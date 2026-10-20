import type { CompanionAction, Personality, Signals } from './types';

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function personality(signals: Signals): Personality {
  const earnest = clamp(signals.earlyDays * 12 + (signals.longFocusToday ? 20 : 0) + signals.studyFocusDays * 8);
  const lively = clamp(signals.streak * 10 + signals.categoryPoints.exercise * 4);
  const gentle = clamp(signals.nightDays * 12 + (signals.restedToday ? 8 : 0));
  const particular = clamp(signals.categoryPoints.creative * 4 + signals.categoryPoints.work * 3);
  const clingy = clamp(signals.streak * 15 + signals.grownBlooms * 8);
  const axes = [
    ['まじめ', earnest],
    ['げんき', lively],
    ['おっとり', gentle],
    ['こだわり', particular],
    ['甘えんぼ', clingy],
  ] as const;
  const top = [...axes].sort((a, b) => b[1] - a[1])[0];
  return {
    earnest,
    lively,
    gentle,
    particular,
    clingy,
    label: top[1] < 15 ? '様子を見ている' : top[0],
  };
}

export function companionAction(signals: Signals, fedToday: boolean): CompanionAction {
  if (fedToday) return 'eat';
  if (signals.longFocusToday) return 'study';
  if (signals.restedToday || (signals.todayRate === 0 && !signals.completedToday)) return 'rest';
  if (signals.streak >= 3 && signals.completedToday) return 'cling';
  if (signals.completedToday) return 'jump';
  if (signals.engagedToday) return 'water';
  return 'idle';
}
