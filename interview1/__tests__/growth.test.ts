import { atLocal } from '../src/domain/time';
import { applyCook, canCook, RECIPES } from '../src/domain/cooking';
import { assuresSurvival, linesFor, pickLine, SOFT_BANNED } from '../src/domain/dialogue';
import { plantView } from '../src/domain/plant';
import { seasonOf } from '../src/domain/season';
import { secretUnlocked, SECRETS } from '../src/domain/secrets';
import { computeSignals } from '../src/domain/signals';
import { slimeFromSignals } from '../src/domain/slime';
import { mixFlower } from '../src/domain/synthesis';
import { isEarly, isLastMinute, isNight } from '../src/domain/time';
import type { Difficulty, FlowerGene, Situation, Task } from '../src/domain/types';
import { DIFFICULTIES } from '../src/domain/types';

function task(partial: Partial<Task> & { id: string }): Task {
  return {
    title: 'タスク',
    category: 'study',
    difficulty: 'normal',
    dueAt: null,
    createdAt: atLocal(2026, 10, 1, 9),
    status: 'open',
    startedAt: null,
    completedAt: null,
    restedAt: null,
    focusChunks: [],
    ...partial,
  };
}

describe('時間の判定', () => {
  const due = atLocal(2026, 10, 18, 18, 0);

  test('夜は21時から5時の前', () => {
    expect(isNight(atLocal(2026, 10, 18, 22, 0))).toBe(true);
    expect(isNight(atLocal(2026, 10, 18, 4, 30))).toBe(true);
    expect(isNight(atLocal(2026, 10, 18, 10, 0))).toBe(false);
    expect(isNight(atLocal(2026, 10, 18, 5, 0))).toBe(false);
  });

  test('3時間より前の完了は早め、直前1時間はギリギリ', () => {
    expect(isEarly(atLocal(2026, 10, 18, 14, 0), due)).toBe(true);
    expect(isEarly(atLocal(2026, 10, 18, 17, 0), due)).toBe(false);
    expect(isLastMinute(atLocal(2026, 10, 18, 17, 30), due)).toBe(true);
    expect(isLastMinute(atLocal(2026, 10, 18, 14, 0), due)).toBe(false);
    expect(isLastMinute(atLocal(2026, 10, 18, 16, 0), due)).toBe(false);
  });
});

describe('達成率と生存', () => {
  const now = atLocal(2026, 10, 18, 12, 0);

  test('0%でも株は生きて葉が丸まる', () => {
    const tasks = [
      task({ id: 'a', dueAt: atLocal(2026, 10, 18, 18, 0) }),
      task({ id: 'b', dueAt: atLocal(2026, 10, 18, 21, 0) }),
    ];
    const signals = computeSignals(tasks, now);
    const plant = plantView(signals);
    expect(signals.todayRate).toBe(0);
    expect(plant.alive).toBe(true);
    expect(plant.stage).toBe('curled');
    expect(plant.curled).toBe(true);
  });

  test('期限つきタスクがなければ達成率は出さず、芽のまま生きる', () => {
    const signals = computeSignals([], now);
    const plant = plantView(signals);
    expect(signals.todayRate).toBeNull();
    expect(plant.alive).toBe(true);
    expect(plant.stage).toBe('sprout');
  });

  test('連続が途切れても、それまでに増えた花は残る', () => {
    const tasks = [16, 17, 18].map((day) =>
      task({
        id: `d${day}`,
        status: 'done',
        startedAt: atLocal(2026, 10, day, 10, 0),
        completedAt: atLocal(2026, 10, day, 11, 0),
      }),
    );
    const during = computeSignals(tasks, atLocal(2026, 10, 18, 12, 0));
    const afterGap = computeSignals(tasks, atLocal(2026, 10, 20, 12, 0));
    expect(during.streak).toBe(3);
    expect(afterGap.streak).toBe(0);
    expect(afterGap.restedYesterday).toBe(true);
    expect(afterGap.maxStreak).toBe(3);
    expect(plantView(afterGap).flowerCount).toBe(plantView(during).flowerCount);
    expect(plantView(afterGap).alive).toBe(true);
  });

  test('今日まだ触れていなくても、昨日まで続いていれば連続は残る', () => {
    const tasks = [
      task({
        id: 'y',
        status: 'done',
        completedAt: atLocal(2026, 10, 17, 11, 0),
        startedAt: atLocal(2026, 10, 17, 10, 0),
      }),
    ];
    const signals = computeSignals(tasks, atLocal(2026, 10, 18, 9, 0));
    expect(signals.streak).toBe(1);
    expect(signals.restedYesterday).toBe(false);
  });
});

describe('スライム', () => {
  const now = atLocal(2026, 10, 18, 15, 0);

  function done(id: string, category: Task['category'], count: number): Task[] {
    return Array.from({ length: count }, (_, index) =>
      task({
        id: `${id}-${index}`,
        category,
        status: 'done',
        dueAt: atLocal(2026, 10, 18, 18, 0),
        completedAt: atLocal(2026, 10, 18, 12, 0),
      }),
    );
  }

  test('運動が多ければ炎、勉強なら氷、創作なら光', () => {
    expect(slimeFromSignals(computeSignals(done('e', 'exercise', 4), now)).element).toBe('fire');
    expect(slimeFromSignals(computeSignals(done('s', 'study', 4), now)).element).toBe('ice');
    expect(slimeFromSignals(computeSignals(done('c', 'creative', 4), now)).element).toBe('light');
  });

  test('三区分が近ければ虹', () => {
    const tasks = [
      ...done('e', 'exercise', 3),
      ...done('s', 'study', 3),
      ...done('w', 'work', 3),
    ];
    expect(slimeFromSignals(computeSignals(tasks, now)).element).toBe('rainbow');
  });
});

describe('隠し進化', () => {
  test('夜の完了が7回で月下の青蓮', () => {
    const tasks = Array.from({ length: 7 }, (_, index) =>
      task({
        id: `n${index}`,
        status: 'done',
        completedAt: atLocal(2026, 10, 10 + index, 22, 0),
      }),
    );
    const signals = computeSignals(tasks, atLocal(2026, 10, 18, 12, 0));
    expect(secretUnlocked(SECRETS.find((item) => item.id === 'flower:moon_lotus')!, signals)).toBe(true);
    expect(plantView(signals).mutation).toBe('moon_lotus');
    expect(plantView(signals).alive).toBe(true);
  });

  test('早めの完了が7回で金の花', () => {
    const tasks = Array.from({ length: 7 }, (_, index) =>
      task({
        id: `e${index}`,
        status: 'done',
        dueAt: atLocal(2026, 10, 10 + index, 18, 0),
        completedAt: atLocal(2026, 10, 10 + index, 9, 0),
      }),
    );
    const signals = computeSignals(tasks, atLocal(2026, 10, 18, 12, 0));
    expect(plantView(signals).mutation).toBe('gold');
  });
});

describe('口調', () => {
  const situations: Situation[] = [
    'complete',
    'early',
    'night',
    'last_minute',
    'streak',
    'rest',
    'long_focus',
    'partial',
    'idle',
  ];

  test('休息の言葉はどの難易度でも生存を保証する', () => {
    for (const difficulty of DIFFICULTIES) {
      for (const line of linesFor(difficulty, 'rest')) {
        expect(assuresSurvival(line)).toBe(true);
      }
    }
  });

  test('ソフト側に厳しい言い回しを混ぜない', () => {
    for (const difficulty of ['super_soft', 'soft'] as Difficulty[]) {
      for (const situation of situations) {
        for (const line of linesFor(difficulty, situation)) {
          for (const banned of SOFT_BANNED) {
            expect(line.includes(banned)).toBe(false);
          }
        }
      }
    }
  });

  test('スーパーハードの完了は鋭い', () => {
    const line = pickLine('super_hard', 'complete', 0);
    expect(line.includes('満足するな') || line.includes('通過点') || line.includes('足りない')).toBe(true);
  });
});

describe('合成と料理と季節', () => {
  test('掛け合わせても親は変わらない', () => {
    const parentA: FlowerGene = {
      id: 'a',
      name: '赤',
      hueA: '#f00',
      hueB: '#fcc',
      petals: 5,
      leaf: 'round',
      glow: false,
      moon: true,
    };
    const parentB: FlowerGene = {
      id: 'b',
      name: '青',
      hueA: '#00f',
      hueB: '#ccf',
      petals: 7,
      leaf: 'long',
      glow: true,
      moon: false,
    };
    const beforeA = { ...parentA };
    const beforeB = { ...parentB };
    const child = mixFlower(parentA, parentB, 'salt');
    expect(parentA).toEqual(beforeA);
    expect(parentB).toEqual(beforeB);
    expect(child.glow).toBe(true);
    expect(child.moon).toBe(true);
    expect(child.petals).toBe(6);
    expect(child.id).not.toBe(parentA.id);
  });

  test('材料が足りなければ減らず、足りれば料理ができる', () => {
    const salad = RECIPES[0];
    const failed = applyCook({ tomato: 1 }, salad);
    expect(failed.ok).toBe(false);
    expect(canCook({ tomato: 1, strawberry: 1 }, salad)).toBe(true);
    const cooked = applyCook({ tomato: 1, strawberry: 1, mushroom: 0 }, salad);
    expect(cooked.ok).toBe(true);
    if (cooked.ok) {
      expect(cooked.inventory.tomato).toBe(0);
      expect(cooked.inventory.strawberry).toBe(0);
      expect(cooked.inventory.salad).toBe(1);
    }
  });

  test('10月は秋', () => {
    expect(seasonOf(atLocal(2026, 10, 19, 12, 0)).id).toBe('autumn');
  });
});
