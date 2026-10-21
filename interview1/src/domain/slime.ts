import type { Signals, SlimeAura, SlimeBody, SlimeElement, SlimeEyes, SlimeGenes, SlimePattern } from './types';

export const SLIME_ELEMENTS: SlimeElement[] = ['fire', 'ice', 'light', 'rainbow', 'earth', 'leaf'];
export const SLIME_BODIES: SlimeBody[] = ['round', 'tall', 'wide', 'blob', 'spiky'];
export const SLIME_EYES: SlimeEyes[] = ['dot', 'big', 'sleepy', 'star'];
export const SLIME_PATTERNS: SlimePattern[] = ['none', 'spots', 'stripes', 'stars'];
export const SLIME_AURAS: SlimeAura[] = ['none', 'flame', 'frost', 'sparkle'];

export const ELEMENT_LABEL: Record<SlimeElement, string> = {
  fire: '炎',
  ice: '氷',
  light: '光',
  rainbow: '虹',
  earth: '土',
  leaf: '葉',
};

export const BODY_LABEL: Record<SlimeBody, string> = {
  round: '真円',
  tall: '首なが',
  wide: '横幅',
  blob: 'とろけ',
  spiky: 'とげ自慢',
};

export const EYES_LABEL: Record<SlimeEyes, string> = {
  dot: '無関心',
  big: '見開き',
  sleepy: '半目',
  star: '星目',
};

export const ELEMENT_COLOR: Record<SlimeElement, string> = {
  fire: '#e36a45',
  ice: '#9fd4ea',
  light: '#f4e3a1',
  rainbow: '#e7a0c8',
  earth: '#c48a52',
  leaf: '#7dae6a',
};

export function slimeId(genes: SlimeGenes): string {
  return `slime:${genes.element}:${genes.body}:${genes.eyes}:${genes.pattern}:${genes.aura}`;
}

export function slimeName(genes: SlimeGenes): string {
  return `${ELEMENT_LABEL[genes.element]}の${BODY_LABEL[genes.body]}（${EYES_LABEL[genes.eyes]}）`;
}

export function slimeGrowthLine(signals: Signals): string {
  if (signals.totalPoints <= 0 && signals.streak <= 0) {
    return 'まだ何もしてない。スライムは真円で、目は点。無難を極めている。';
  }
  const eyes = eyesJoke(signals);
  return `${bodyJoke(signals.streak)} ${elementJoke(signals)}${eyes ? ` ${eyes}` : ''}`;
}

function bodyJoke(streak: number): string {
  if (streak >= 14) return '14日続くと、自慢でとげが生える。近づくと偉そう。';
  if (streak >= 7) return '7日続くと、見下ろしたくて首が伸びる。';
  if (streak >= 3) return '3日続くと、自信が横幅になる。';
  if (streak >= 1) return '1日やっただけで、嬉しさでとろけた。';
  return '連続が切れると、また無難な丸に戻る。とげは引っ込む。';
}

function elementJoke(signals: Signals): string {
  if (signals.totalPoints <= 0) return '色は草のまま。';
  if (signals.dominantCategory === 'balance') return '偏らないので虹。何屋か本人も分かってない。';
  switch (signals.dominantCategory) {
    case 'exercise':
      return '運動が多いと燃える。本人は涼しい顔。';
    case 'study':
      return '勉強が多いと冷える。頭がかちかち。';
    case 'creative':
      return '創作が多いと光る。少し眩しい。';
    case 'work':
      return '仕事が多いと土色。現場の顔。';
    case 'housework':
      return '家事が多いと葉っぱ。掃除のあと。';
  }
}

function eyesJoke(signals: Signals): string {
  if (signals.nightDays > signals.earlyDays + 1) return '夜型なので目が半分。起きてるつもり。';
  if (signals.earlyDays > signals.nightDays + 1) return '朝型なので目が星。ちょっとうるさい。';
  if (signals.studyFocusDays >= 2 || signals.longFocusToday) return '長く見てるので、目が見開いてる。';
  return '';
}

export function allSlimes(): SlimeGenes[] {
  const list: SlimeGenes[] = [];
  for (const element of SLIME_ELEMENTS) {
    for (const body of SLIME_BODIES) {
      for (const eyes of SLIME_EYES) {
        for (const pattern of SLIME_PATTERNS) {
          for (const aura of SLIME_AURAS) {
            list.push({ element, body, eyes, pattern, aura });
          }
        }
      }
    }
  }
  return list;
}

export const SLIME_CATALOG_SIZE = SLIME_ELEMENTS.length * SLIME_BODIES.length * SLIME_EYES.length * SLIME_PATTERNS.length * SLIME_AURAS.length;

export function slimeFromSignals(signals: Signals): SlimeGenes {
  return {
    element: elementOf(signals),
    body: bodyOf(signals),
    eyes: eyesOf(signals),
    pattern: patternOf(signals),
    aura: auraOf(signals),
  };
}

function elementOf(signals: Signals): SlimeElement {
  if (signals.totalPoints <= 0) return 'leaf';
  if (signals.dominantCategory === 'balance') return 'rainbow';
  switch (signals.dominantCategory) {
    case 'exercise':
      return 'fire';
    case 'study':
      return 'ice';
    case 'creative':
      return 'light';
    case 'work':
      return 'earth';
    case 'housework':
      return 'leaf';
  }
}

function bodyOf(signals: Signals): SlimeBody {
  const streak = signals.streak;
  if (streak >= 14) return 'spiky';
  if (streak >= 7) return 'tall';
  if (streak >= 3) return 'wide';
  if (streak >= 1) return 'blob';
  return 'round';
}

function eyesOf(signals: Signals): SlimeEyes {
  if (signals.nightDays > signals.earlyDays + 1) return 'sleepy';
  if (signals.earlyDays > signals.nightDays + 1) return 'star';
  if (signals.studyFocusDays >= 2 || signals.longFocusToday) return 'big';
  return 'dot';
}

function patternOf(signals: Signals): SlimePattern {
  if (signals.totalPoints >= 24) return 'stars';
  if (signals.totalPoints >= 10) return 'stripes';
  if (signals.totalPoints >= 3) return 'spots';
  return 'none';
}

function auraOf(signals: Signals, element = elementOf(signals)): SlimeAura {
  if (signals.todayRate == null || signals.todayRate < 0.25) return 'none';
  if (element === 'fire') return 'flame';
  if (element === 'ice') return 'frost';
  if (signals.todayRate >= 0.5) return 'sparkle';
  return 'none';
}
