import { CATEGORY_HUE, CATEGORY_HUE_B } from './labels';
import type { MutationId, PlantStage, PlantView, Signals } from './types';

export function stageForRate(rate: number | null): PlantStage {
  if (rate == null) return 'sprout';
  if (rate < 0.25) return 'curled';
  if (rate < 0.5) return 'leaves';
  if (rate < 0.75) return 'bud';
  return 'bloom';
}

export function stageCaption(stage: PlantStage): string {
  switch (stage) {
    case 'sprout':
      return '今日の期限つきタスクはまだない。株は元気なまま待っている。';
    case 'curled':
      return '葉が丸まり、うとうとしている。枯れてはいない。';
    case 'leaves':
      return '葉が広がってきた。';
    case 'bud':
      return '葉が広がり、つぼみができる。';
    case 'bloom':
      return '花が開いている。';
  }
}

export function mutationFor(signals: Signals): MutationId {
  const moon = signals.nightCount >= 7;
  const gold = signals.earlyCount >= 7;
  if (moon && gold) return signals.nightCount >= signals.earlyCount ? 'moon_lotus' : 'gold';
  if (moon) return 'moon_lotus';
  if (gold) return 'gold';
  if (signals.fullSpectrumDays >= 1) return 'spectrum';
  return null;
}

export function plantView(signals: Signals, previewRate?: number | null): PlantView {
  const rate = previewRate === undefined ? signals.todayRate : previewRate;
  const stage = stageForRate(rate);
  const mutation = mutationFor(signals);
  const curled = stage === 'curled';
  const sleepy = curled || (signals.restedToday && !signals.completedToday);
  const glow = signals.earlyToday || signals.earlyDays >= 2 || mutation === 'gold';
  const moonlit = signals.nightToday || signals.nightDays >= 2 || mutation === 'moon_lotus';
  const multi = mutation === 'spectrum' || signals.dominantCategory === 'balance';
  const hue =
    mutation === 'moon_lotus'
      ? '#9bb7ff'
      : mutation === 'gold'
        ? '#e6c15a'
        : CATEGORY_HUE[signals.dominantCategory];
  const hueB =
    mutation === 'moon_lotus'
      ? '#e8f0ff'
      : mutation === 'gold'
        ? '#fff1c2'
        : CATEGORY_HUE_B[signals.dominantCategory];
  const petals = mutation === 'moon_lotus' ? 8 : mutation === 'gold' ? 6 : multi ? 7 : 5;

  return {
    alive: true,
    stage,
    caption: previewRate === undefined ? stageCaption(stage) : `プレビュー。${stageCaption(stage)} セーブはしない。`,
    flowerCount: 1 + signals.grownBlooms,
    glow,
    moonlit,
    sleepy,
    curled,
    fruit: stage === 'bloom' && (signals.streak >= 2 || signals.grownBlooms >= 1),
    hue,
    hueB,
    multi,
    petals,
    mutation,
  };
}
