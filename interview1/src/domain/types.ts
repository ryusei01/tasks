export const CATEGORIES = ['exercise', 'study', 'work', 'housework', 'creative'] as const;
export type Category = (typeof CATEGORIES)[number];

export const DIFFICULTIES = ['super_soft', 'soft', 'normal', 'hard', 'super_hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const TASK_STATUSES = ['open', 'started', 'done', 'rest'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface FocusChunk {
  at: number;
  seconds: number;
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  dueAt: number | null;
  createdAt: number;
  status: TaskStatus;
  startedAt: number | null;
  completedAt: number | null;
  restedAt: number | null;
  focusChunks: FocusChunk[];
}

export type Situation =
  | 'complete'
  | 'early'
  | 'night'
  | 'last_minute'
  | 'streak'
  | 'rest'
  | 'long_focus'
  | 'partial'
  | 'idle';

export interface Signals {
  todayKey: string;
  todayRate: number | null;
  dueToday: number;
  doneTodayDue: number;
  streak: number;
  maxStreak: number;
  restedYesterday: boolean;
  engagedToday: boolean;
  completedToday: boolean;
  restedToday: boolean;
  startedToday: boolean;
  earlyToday: boolean;
  nightToday: boolean;
  lastMinuteToday: boolean;
  longFocusToday: boolean;
  focusMinutesToday: number;
  earlyCount: number;
  nightCount: number;
  lastMinuteCount: number;
  nightDays: number;
  earlyDays: number;
  balancedDays: number;
  fullSpectrumDays: number;
  studyFocusDays: number;
  categoryPoints: Record<Category, number>;
  grownBlooms: number;
  dominantCategory: Category | 'balance';
  totalPoints: number;
}

export type PlantStage = 'sprout' | 'curled' | 'leaves' | 'bud' | 'bloom';
export type MutationId = 'moon_lotus' | 'gold' | 'spectrum' | null;

export interface PlantView {
  alive: true;
  stage: PlantStage;
  caption: string;
  flowerCount: number;
  glow: boolean;
  moonlit: boolean;
  sleepy: boolean;
  curled: boolean;
  fruit: boolean;
  hue: string;
  hueB: string;
  multi: boolean;
  petals: number;
  mutation: MutationId;
}

export type ProduceKind = 'tomato' | 'strawberry' | 'mushroom';
export type ProduceMood = 'dance' | 'sweat' | 'sulk' | 'rest' | 'idle' | 'happy';

export interface ProduceView {
  kind: ProduceKind;
  size: number;
  mood: ProduceMood;
  ripe: boolean;
}

export type CompanionAction = 'idle' | 'jump' | 'study' | 'cling' | 'rest' | 'water' | 'eat';

export interface Personality {
  earnest: number;
  lively: number;
  gentle: number;
  particular: number;
  clingy: number;
  label: string;
}

export interface WorldView {
  forest: number;
  river: number;
  library: number;
  buildings: number;
  cleanliness: number;
  atelier: number;
}

export type SlimeElement = 'fire' | 'ice' | 'light' | 'rainbow' | 'earth' | 'leaf';
export type SlimeBody = 'round' | 'tall' | 'wide' | 'blob' | 'spiky';
export type SlimeEyes = 'dot' | 'big' | 'sleepy' | 'star';
export type SlimePattern = 'none' | 'spots' | 'stripes' | 'stars';
export type SlimeAura = 'none' | 'flame' | 'frost' | 'sparkle';

export interface SlimeGenes {
  element: SlimeElement;
  body: SlimeBody;
  eyes: SlimeEyes;
  pattern: SlimePattern;
  aura: SlimeAura;
}

export type LeafStyle = 'round' | 'long' | 'curl';

export interface FlowerGene {
  id: string;
  name: string;
  hueA: string;
  hueB: string;
  petals: number;
  leaf: LeafStyle;
  glow: boolean;
  moon: boolean;
}

export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonInfo {
  id: SeasonId;
  name: string;
  plantName: string;
  visitorName: string;
  plantId: string;
  visitorId: string;
  plantHue: string;
}
