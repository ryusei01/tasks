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
  forest: ['空き地。木が面接中', '木が一本。気合だけ', '林。木同士が知り合いになった', '森。迷う練習ができる', '深い森。汗が霧になってる', '古い森。木が先輩面'],
  river: ['乾いた筋。水はまだ履歴書', '細い水。チョロチョロと主張', '小川。靴が濡れるサイズ', '川。飛び石が本気', '広い川。対岸が遠い顔', '湖へ続く川。運動が水になった'],
  library: ['更地。本の気配ゼロ', '本棚ひとつ。背表紙が寂しい', '小さな閲覧室。静かにする練習', '図書館。司書が目を細める', '大きな図書館。迷子になれる', '夜も開く図書館。本が眠らない'],
  buildings: ['更地。仕事がまだ土地', '小屋。机が一つで得意', '仕事場。コーヒーの匂い', '建物。看板ができた', '並んだ建物。隣と挨拶', '街の核。仕事が町を起こした'],
  cleanliness: ['落ち葉が多い。踏むと音', '掃き始めた。ホウキが主役', '道が見える。落ち葉が端へ避難', 'きれいな道。靴が喜ぶ', '花の道。掃除が浮かれてる', '磨かれた石畳。顔が映る'],
  atelier: ['暗い空き地。アイデアが寝てる', '灯りの種。マッチ一本', '小さな窓。中で何かしてる', 'アトリエ。絵の具が床にいる', '灯りの小路。夜でも作業', '光る工房。創作が漏れてる'],
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
