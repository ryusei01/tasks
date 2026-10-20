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
    blurb: '葉を八回、やさしく叩く。',
    unlockText: 'タスクを1つ終えると遊べる。',
  },
  {
    id: 'harvest',
    name: '収穫あそび',
    blurb: '落ちてくる実を六つ拾う。',
    unlockText: 'タスクを3つ終えると遊べる。',
  },
  {
    id: 'bounce',
    name: 'スライムバウンド',
    blurb: 'スライムを十回はずませる。',
    unlockText: '連続2日、または5つ終えると遊べる。',
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
