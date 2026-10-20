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
  round: '丸',
  tall: '細長',
  wide: '横広',
  blob: 'とろ',
  spiky: 'とげ',
};

export const EYES_LABEL: Record<SlimeEyes, string> = {
  dot: '点目',
  big: '大目',
  sleepy: 'ねむ目',
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
  return `${ELEMENT_LABEL[genes.element]}・${BODY_LABEL[genes.body]}・${EYES_LABEL[genes.eyes]}`;
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
