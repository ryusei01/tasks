import type { Signals, WorldView } from './types';

export function levelFromPoints(points: number): number {
  if (points <= 0) return 0;
  if (points < 2) return 1;
  if (points < 5) return 2;
  if (points < 10) return 3;
  if (points < 18) return 4;
  return 5;
}

export function worldView(signals: Signals): WorldView {
  const points = signals.categoryPoints;
  return {
    forest: levelFromPoints(points.exercise),
    river: levelFromPoints(Math.floor(points.exercise * 0.7)),
    library: levelFromPoints(points.study),
    buildings: levelFromPoints(points.work),
    cleanliness: levelFromPoints(points.housework),
    atelier: levelFromPoints(points.creative),
  };
}

export interface WorldRow {
  key: keyof WorldView;
  label: string;
  detail: string;
}

const COPY: Record<keyof WorldView, string[]> = {
  forest: ['空き地', '若木', '林', '森', '深い森', '古い森'],
  river: ['乾いた筋', '細い水', '小川', '川', '広い川', '湖へ続く川'],
  library: ['更地', '本棚ひとつ', '小さな閲覧室', '図書館', '大きな図書館', '夜も開く図書館'],
  buildings: ['更地', '小屋', '仕事場', '建物', '並んだ建物', '街の核'],
  cleanliness: ['落ち葉が多い', '掃き始めた', '道が見える', 'きれいな道', '花の道', '磨かれた石畳'],
  atelier: ['暗い空き地', '灯りの種', '小さな窓', 'アトリエ', '灯りの小路', '光る工房'],
};

export function worldRows(world: WorldView): WorldRow[] {
  const labels: Record<keyof WorldView, string> = {
    forest: '運動 → 森',
    river: '運動 → 川',
    library: '勉強 → 図書館',
    buildings: '仕事 → 建物',
    cleanliness: '家事 → 道',
    atelier: '創作 → アトリエ',
  };
  return (Object.keys(labels) as (keyof WorldView)[]).map((key) => ({
    key,
    label: labels[key],
    detail: COPY[key][world[key]] ?? COPY[key][0],
  }));
}
