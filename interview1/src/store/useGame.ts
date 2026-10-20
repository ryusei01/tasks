import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { applyCook, recipeById } from '../domain/cooking';
import { pickLine, situationFor } from '../domain/dialogue';
import { saltFrom, uid } from '../domain/id';
import { computeSignals } from '../domain/signals';
import { mixFlower } from '../domain/synthesis';
import { dateKey } from '../domain/time';
import type { Category, Difficulty, FlowerGene, ProduceKind, Task } from '../domain/types';
import { PRODUCE_LABEL } from '../domain/labels';

export interface Speech {
  text: string;
  at: number;
}

interface GameState {
  tasks: Task[];
  inventory: Record<string, number>;
  cooked: string[];
  nursery: FlowerGene[];
  discoveries: string[];
  harvestedOn: Partial<Record<ProduceKind, string>>;
  meal: { date: string; dishId: string } | null;
  lastSpeech: Speech | null;
  playedMinigames: string[];
  addTask: (input: { title: string; category: Category; difficulty: Difficulty; dueAt: number | null; now: number }) => string;
  updateTask: (id: string, patch: Partial<Pick<Task, 'title' | 'category' | 'difficulty' | 'dueAt'>>) => void;
  removeTask: (id: string) => void;
  addFocus: (id: string, seconds: number, at: number) => void;
  startTask: (id: string, at: number) => string;
  completeTask: (id: string, at: number) => string;
  restTask: (id: string, at: number) => string;
  harvest: (kind: ProduceKind, ripe: boolean, at: number) => string;
  cookDish: (recipeId: string, at: number) => string;
  feed: (dishId: string, at: number) => string;
  keepSpecimen: (gene: FlowerGene, at: number) => string;
  synthesize: (parentA: FlowerGene, parentB: FlowerGene, at: number) => string;
  discover: (ids: string[]) => void;
  finishMinigame: (id: string, at: number) => string;
}

function say(text: string, at: number): Speech {
  return { text, at };
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      tasks: [],
      inventory: {},
      cooked: [],
      nursery: [],
      discoveries: [],
      harvestedOn: {},
      meal: null,
      lastSpeech: null,
      playedMinigames: [],
      addTask: ({ title, category, difficulty, dueAt, now }) => {
        const id = uid();
        const task: Task = {
          id,
          title: title.trim(),
          category,
          difficulty,
          dueAt,
          createdAt: now,
          status: 'open',
          startedAt: null,
          completedAt: null,
          restedAt: null,
          focusChunks: [],
        };
        set((state) => ({ tasks: [task, ...state.tasks] }));
        return id;
      },
      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)),
        })),
      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      addFocus: (id, seconds, at) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id || task.status === 'done' || seconds <= 0) return task;
            return {
              ...task,
              status: task.status === 'rest' || task.status === 'open' ? 'started' : task.status,
              startedAt: task.startedAt ?? at,
              focusChunks: [...task.focusChunks, { at, seconds }],
            };
          }),
        })),
      startTask: (id, at) => {
        const task = get().tasks.find((item) => item.id === id);
        if (!task) return '';
        if (task.status === 'done') {
          const text = 'すでに終えている。';
          set({ lastSpeech: say(text, at) });
          return text;
        }
        const next = get().tasks.map((item) =>
          item.id === id
            ? { ...item, status: 'started' as const, startedAt: item.startedAt ?? at, restedAt: null }
            : item,
        );
        const signals = computeSignals(next, at);
        const text = pickLine(task.difficulty, situationFor('start', { ...task, startedAt: at }, signals), saltFrom(id + 'start'));
        set({ tasks: next, lastSpeech: say(text, at) });
        return text;
      },
      completeTask: (id, at) => {
        const task = get().tasks.find((item) => item.id === id);
        if (!task) return '';
        if (task.status === 'done') {
          const text = 'すでに終えている。';
          set({ lastSpeech: say(text, at) });
          return text;
        }
        const finished: Task = {
          ...task,
          status: 'done',
          completedAt: at,
          startedAt: task.startedAt ?? at,
        };
        const tasks = get().tasks.map((item) => (item.id === id ? finished : item));
        const signals = computeSignals(tasks, at);
        const text = pickLine(task.difficulty, situationFor('complete', finished, signals), saltFrom(id + 'done'));
        set({ tasks, lastSpeech: say(text, at) });
        return text;
      },
      restTask: (id, at) => {
        const task = get().tasks.find((item) => item.id === id);
        if (!task) return '';
        if (task.status === 'done') {
          const text = '終えたタスクは、そのままでいい。';
          set({ lastSpeech: say(text, at) });
          return text;
        }
        const resting: Task = { ...task, status: 'rest', restedAt: at };
        const tasks = get().tasks.map((item) => (item.id === id ? resting : item));
        const text = pickLine(task.difficulty, 'rest', saltFrom(id + 'rest'));
        set({ tasks, lastSpeech: say(text, at) });
        return text;
      },
      harvest: (kind, ripe, at) => {
        const key = dateKey(at);
        if (get().harvestedOn[kind] === key) {
          const text = `今日の${PRODUCE_LABEL[kind]}はもう収穫した。株は残っている。`;
          set({ lastSpeech: say(text, at) });
          return text;
        }
        if (!ripe) {
          const text = `${PRODUCE_LABEL[kind]}はまだ小さい。取り組みが重なると実る。株は元気だ。`;
          set({ lastSpeech: say(text, at) });
          return text;
        }
        const text = `${PRODUCE_LABEL[kind]}を収穫した。株は残っている。`;
        set((state) => ({
          inventory: { ...state.inventory, [kind]: (state.inventory[kind] ?? 0) + 1 },
          harvestedOn: { ...state.harvestedOn, [kind]: key },
          lastSpeech: say(text, at),
        }));
        return text;
      },
      cookDish: (recipeId, at) => {
        const recipe = recipeById(recipeId);
        if (!recipe) return 'レシピがない。';
        const result = applyCook(get().inventory, recipe);
        if (!result.ok) {
          set({ lastSpeech: say(result.reason, at) });
          return result.reason;
        }
        const text = `${recipe.name}ができた。${recipe.line}`;
        set((state) => ({
          inventory: result.inventory,
          cooked: state.cooked.includes(recipe.id) ? state.cooked : [...state.cooked, recipe.id],
          lastSpeech: say(text, at),
        }));
        return text;
      },
      feed: (dishId, at) => {
        const recipe = recipeById(dishId);
        if (!recipe) return '料理が見つからない。';
        const key = dateKey(at);
        if (get().meal?.date === key) {
          const text = '今日はもう食べた。表情は変わったままだ。';
          set({ lastSpeech: say(text, at) });
          return text;
        }
        if ((get().inventory[dishId] ?? 0) < 1) {
          const text = 'まだその料理はない。';
          set({ lastSpeech: say(text, at) });
          return text;
        }
        set((state) => ({
          inventory: { ...state.inventory, [dishId]: (state.inventory[dishId] ?? 0) - 1 },
          meal: { date: key, dishId },
          lastSpeech: say(recipe.line, at),
        }));
        return recipe.line;
      },
      keepSpecimen: (gene, at) => {
        const exists = get().nursery.some(
          (item) =>
            item.name === gene.name &&
            item.hueA === gene.hueA &&
            item.petals === gene.petals &&
            item.glow === gene.glow &&
            item.moon === gene.moon,
        );
        if (exists) {
          const text = 'この姿の標本はすでにある。親株はそのままだ。';
          set({ lastSpeech: say(text, at) });
          return text;
        }
        const copy: FlowerGene = { ...gene, id: uid(), name: gene.name };
        const text = '標本にした。庭の花はそのまま残っている。';
        set((state) => ({ nursery: [...state.nursery, copy], lastSpeech: say(text, at) }));
        return text;
      },
      synthesize: (parentA, parentB, at) => {
        if (parentA.id === parentB.id) {
          const text = '別々の花を二株選んで。親は残したまま掛けられる。';
          set({ lastSpeech: say(text, at) });
          return text;
        }
        const child = mixFlower(parentA, parentB, uid());
        const text = `${child.name}が生まれた。親の花は残っている。`;
        set((state) => ({ nursery: [...state.nursery, child], lastSpeech: say(text, at) }));
        return text;
      },
      discover: (ids) =>
        set((state) => {
          const fresh = ids.filter((id) => id && !state.discoveries.includes(id));
          if (fresh.length === 0) return state;
          return { discoveries: [...state.discoveries, ...fresh] };
        }),
      finishMinigame: (id, at) => {
        const text =
          id === 'water'
            ? '水をやった。葉が揺れた。'
            : id === 'harvest'
              ? '実を拾った。株は残っている。'
              : 'スライムがはずんだ。姿は枯れない。';
        set((state) => ({
          playedMinigames: state.playedMinigames.includes(id) ? state.playedMinigames : [...state.playedMinigames, id],
          lastSpeech: say(text, at),
        }));
        return text;
      },
    }),
    {
      name: 'hanakoto',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
