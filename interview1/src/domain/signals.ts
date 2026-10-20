import { CATEGORIES } from './types';
import type { Category, Signals, Task } from './types';
import { dateKey, isEarly, isLastMinute, isNight, nextDateKey, previousDateKey } from './time';

const LONG_FOCUS_SECONDS = 20 * 60;

export function emptyPoints(): Record<Category, number> {
  return { exercise: 0, study: 0, work: 0, housework: 0, creative: 0 };
}

export function bloomsFromStreak(maxStreak: number): number {
  if (maxStreak < 2) return 0;
  return Math.min(6, Math.floor(maxStreak / 2));
}

export function computeSignals(tasks: Task[], now: number): Signals {
  const todayKey = dateKey(now);
  const engaged = new Set<string>();
  const nightDates = new Set<string>();
  const earlyDates = new Set<string>();
  const points = emptyPoints();
  const pointsByDay = new Map<string, Record<Category, number>>();
  const completedCatsByDay = new Map<string, Set<Category>>();
  const studyFocusByDay = new Map<string, number>();

  let earlyCount = 0;
  let nightCount = 0;
  let lastMinuteCount = 0;
  let focusToday = 0;
  let completedToday = false;
  let restedToday = false;
  let startedToday = false;
  let earlyToday = false;
  let nightToday = false;
  let lastMinuteToday = false;

  const bumpDay = (day: string, category: Category, amount: number) => {
    const row = pointsByDay.get(day) ?? emptyPoints();
    row[category] += amount;
    pointsByDay.set(day, row);
    points[category] += amount;
  };

  for (const task of tasks) {
    if (task.startedAt) {
      const key = dateKey(task.startedAt);
      engaged.add(key);
      bumpDay(key, task.category, 1);
      if (key === todayKey) startedToday = true;
    }
    if (task.completedAt) {
      const key = dateKey(task.completedAt);
      engaged.add(key);
      bumpDay(key, task.category, 2);
      const cats = completedCatsByDay.get(key) ?? new Set<Category>();
      cats.add(task.category);
      completedCatsByDay.set(key, cats);
      if (isEarly(task.completedAt, task.dueAt)) {
        earlyCount += 1;
        earlyDates.add(key);
        if (key === todayKey) earlyToday = true;
      }
      if (isNight(task.completedAt)) {
        nightCount += 1;
        nightDates.add(key);
        if (key === todayKey) nightToday = true;
      }
      if (isLastMinute(task.completedAt, task.dueAt)) {
        lastMinuteCount += 1;
        if (key === todayKey) lastMinuteToday = true;
      }
      if (key === todayKey) completedToday = true;
    }
    if (task.restedAt && dateKey(task.restedAt) === todayKey) restedToday = true;
    for (const chunk of task.focusChunks) {
      const key = dateKey(chunk.at);
      if (key === todayKey) {
        focusToday += chunk.seconds;
        startedToday = true;
        engaged.add(key);
      }
      if (task.category === 'study') {
        studyFocusByDay.set(key, (studyFocusByDay.get(key) ?? 0) + chunk.seconds);
      }
    }
  }

  const due = tasks.filter((task) => task.dueAt != null && dateKey(task.dueAt) === todayKey);
  const doneTodayDue = due.filter((task) => task.status === 'done').length;
  const todayRate = due.length === 0 ? null : doneTodayDue / due.length;

  const maxStreak = longestStreak([...engaged]);
  const streak = engaged.has(todayKey)
    ? streakEnding(engaged, todayKey)
    : streakEnding(engaged, previousDateKey(todayKey));

  const yesterday = previousDateKey(todayKey);
  const hadEngagementBeforeYesterday = [...engaged].some((key) => key < yesterday);
  const restedYesterday = !engaged.has(yesterday) && hadEngagementBeforeYesterday;

  let balancedDays = 0;
  for (const row of pointsByDay.values()) {
    const ranked = CATEGORIES.map((category) => row[category]).sort((a, b) => b - a);
    const active = ranked.filter((value) => value > 0).length;
    if (active >= 3 && ranked[1] > 0 && ranked[0] < ranked[1] * 1.5) balancedDays += 1;
  }

  let fullSpectrumDays = 0;
  for (const cats of completedCatsByDay.values()) {
    if (cats.size === CATEGORIES.length) fullSpectrumDays += 1;
  }

  let studyFocusDays = 0;
  for (const seconds of studyFocusByDay.values()) {
    if (seconds >= LONG_FOCUS_SECONDS) studyFocusDays += 1;
  }

  const totalPoints = CATEGORIES.reduce((sum, category) => sum + points[category], 0);

  return {
    todayKey,
    todayRate,
    dueToday: due.length,
    doneTodayDue,
    streak,
    maxStreak,
    restedYesterday,
    engagedToday: engaged.has(todayKey),
    completedToday,
    restedToday,
    startedToday,
    earlyToday,
    nightToday,
    lastMinuteToday,
    longFocusToday: focusToday >= LONG_FOCUS_SECONDS,
    focusMinutesToday: Math.floor(focusToday / 60),
    earlyCount,
    nightCount,
    lastMinuteCount,
    nightDays: nightDates.size,
    earlyDays: earlyDates.size,
    balancedDays,
    fullSpectrumDays,
    studyFocusDays,
    categoryPoints: points,
    grownBlooms: bloomsFromStreak(maxStreak),
    dominantCategory: dominant(points, totalPoints),
    totalPoints,
  };
}

function dominant(points: Record<Category, number>, total: number): Category | 'balance' {
  if (total <= 0) return 'balance';
  const ranked = [...CATEGORIES].sort((a, b) => points[b] - points[a]);
  const active = ranked.filter((category) => points[category] > 0).length;
  if (active >= 3 && points[ranked[1]] > 0 && points[ranked[0]] < points[ranked[1]] * 1.35) {
    return 'balance';
  }
  return ranked[0];
}

function longestStreak(dates: string[]): number {
  const sorted = [...dates].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const key of sorted) {
    run = prev && nextDateKey(prev) === key ? run + 1 : 1;
    best = Math.max(best, run);
    prev = key;
  }
  return best;
}

function streakEnding(dates: Set<string>, start: string): number {
  let count = 0;
  let cursor = start;
  while (dates.has(cursor)) {
    count += 1;
    cursor = previousDateKey(cursor);
  }
  return count;
}

export function focusSeconds(task: Task): number {
  return task.focusChunks.reduce((sum, chunk) => sum + chunk.seconds, 0);
}
