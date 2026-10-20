import type { ProduceKind, ProduceMood, ProduceView, Signals } from './types';

const KINDS: ProduceKind[] = ['tomato', 'strawberry', 'mushroom'];

export function produceSize(signals: Signals): number {
  const score = 1 + signals.grownBlooms + Math.min(signals.streak, 6);
  return 1 + Math.min(2, Math.floor(score / 3));
}

export function produceMood(signals: Signals): ProduceMood {
  if (signals.lastMinuteToday) return 'sweat';
  if (signals.completedToday) return 'dance';
  if (signals.restedToday || (signals.todayRate != null && signals.todayRate < 0.25)) return 'sulk';
  if (!signals.engagedToday && signals.restedYesterday) return 'rest';
  if (signals.engagedToday) return 'happy';
  return 'idle';
}

export function produceViews(signals: Signals): ProduceView[] {
  const size = produceSize(signals);
  const mood = produceMood(signals);
  return KINDS.map((kind) => ({
    kind,
    size,
    mood,
    ripe: size >= 2,
  }));
}
