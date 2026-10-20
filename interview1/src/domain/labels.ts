import type { Category, Difficulty, ProduceKind, TaskStatus } from './types';

export const CATEGORY_LABEL: Record<Category, string> = {
  exercise: '運動',
  study: '勉強',
  work: '仕事',
  housework: '家事',
  creative: '創作',
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  super_soft: 'スーパーソフト',
  soft: 'ソフト',
  normal: 'ノーマル',
  hard: 'ハード',
  super_hard: 'スーパーハード',
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
  open: '未着手',
  started: '着手',
  done: '完了',
  rest: '休息',
};

export const PRODUCE_LABEL: Record<ProduceKind, string> = {
  tomato: 'トマト',
  strawberry: 'イチゴ',
  mushroom: 'キノコ',
};

export const CATEGORY_HUE: Record<Category | 'balance', string> = {
  exercise: '#e07a5f',
  study: '#7ea4c8',
  work: '#d7a441',
  housework: '#6f9a62',
  creative: '#c58ad4',
  balance: '#e7a0b4',
};

export const CATEGORY_HUE_B: Record<Category | 'balance', string> = {
  exercise: '#f2c1a0',
  study: '#d5e7f5',
  work: '#f0ddaa',
  housework: '#d7ebc8',
  creative: '#f0d4f6',
  balance: '#f3d27a',
};
