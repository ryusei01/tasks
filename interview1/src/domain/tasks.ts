import type { Difficulty, Task } from './types';
import { dateKey } from './time';

export function duePreset(kind: 'none' | 'tonight' | 'tomorrow' | 'later', now: number): number | null {
  if (kind === 'none') return null;
  const date = new Date(now);
  if (kind === 'tonight') {
    date.setHours(21, 0, 0, 0);
    if (date.getTime() <= now) date.setHours(23, 59, 0, 0);
    return date.getTime();
  }
  date.setDate(date.getDate() + (kind === 'tomorrow' ? 1 : 3));
  date.setHours(18, 0, 0, 0);
  return date.getTime();
}

export function tasksForToday(tasks: Task[], now: number): Task[] {
  const today = dateKey(now);
  return tasks
    .filter((task) => {
      const dueToday = task.dueAt != null && dateKey(task.dueAt) === today;
      const doneToday = task.completedAt != null && dateKey(task.completedAt) === today;
      const open = task.status === 'open' || task.status === 'started';
      const undatedOpen = open && task.dueAt == null;
      const createdToday = open && dateKey(task.createdAt) === today;
      const overdue = open && task.dueAt != null && task.dueAt < now && dateKey(task.dueAt) !== today;
      return dueToday || doneToday || undatedOpen || createdToday || overdue;
    })
    .sort((a, b) => (a.dueAt ?? Number.MAX_SAFE_INTEGER) - (b.dueAt ?? Number.MAX_SAFE_INTEGER));
}

export function latestDifficulty(tasks: Task[]): Difficulty {
  const latest = [...tasks].sort((a, b) => b.createdAt - a.createdAt)[0];
  return latest?.difficulty ?? 'normal';
}

export function completionCount(tasks: Task[]): number {
  return tasks.filter((task) => task.status === 'done').length;
}
