import type { Signals } from './types';

export interface MinigameDef {
  id: 'water' | 'harvest' | 'bounce';
  name: string;
  blurb: string;
  unlockText: string;
}

export const MINIGAMES: readonly MinigameDef[] = [
  {
    id: 'water',
    name: '水やり',
    blurb: '葉を八回叩く。葉が「そこ、くすぐったい」と言う。',
    unlockText: 'タスクを1つ終えると、葉が遊びに付き合う。',
  },
  {
    id: 'harvest',
    name: '収穫あそび',
    blurb: '落ちてくる実を六つ拾う。実は逃げ腰。',
    unlockText: 'タスクを3つ終えると、実が落ちてくる。',
  },
  {
    id: 'bounce',
    name: 'スライムバウンド',
    blurb: 'スライムを十回はずませる。床がかわいそう。',
    unlockText: '連続2日、または5つ終えると、スライムが床を見る。',
  },
];

export function minigameUnlocked(id: MinigameDef['id'], signals: Signals, completions: number): boolean {
  if (id === 'water') return completions >= 1;
  if (id === 'harvest') return completions >= 3;
  return signals.streak >= 2 || completions >= 5;
}

export function minigameById(id: string): MinigameDef | undefined {
  return MINIGAMES.find((game) => game.id === id);
}
