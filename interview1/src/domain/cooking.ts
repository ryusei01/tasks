export interface Recipe {
  id: string;
  name: string;
  needs: Record<string, number>;
  line: string;
}

export const RECIPES: readonly Recipe[] = [
  {
    id: 'salad',
    name: '朝のサラダ',
    needs: { tomato: 1, strawberry: 1 },
    line: 'すっぱい。相棒が「朝からこれ？」と目を細めて、それでも皿を空けた。',
  },
  {
    id: 'stew',
    name: 'きのこの煮込み',
    needs: { tomato: 1, mushroom: 1 },
    line: 'あたたかい。相棒がスプーンを置いて、一緒にとろけた。',
  },
  {
    id: 'jam',
    name: '不思議ジャム',
    needs: { strawberry: 1, mushroom: 1 },
    line: 'きらきら。相棒が瓶を振って、「これ創作？」と本気で聞いた。',
  },
  {
    id: 'soup',
    name: 'トマトスープ',
    needs: { tomato: 2 },
    line: 'ほっとした顔。鼻の穴までスープ。',
  },
  {
    id: 'shortcake',
    name: '小さなショートケーキ',
    needs: { strawberry: 2 },
    line: '甘い。相棒が跳ねて、クリームが帽子になった。',
  },
  {
    id: 'grill',
    name: '焼きキノコ',
    needs: { mushroom: 2 },
    line: 'いい匂い。甘えてきて、キノコの片側をねだった。',
  },
];

export function recipeById(id: string): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.id === id);
}

export function canCook(inventory: Record<string, number>, recipe: Recipe): boolean {
  return Object.entries(recipe.needs).every(([key, count]) => (inventory[key] ?? 0) >= count);
}

export function applyCook(
  inventory: Record<string, number>,
  recipe: Recipe,
): { ok: true; inventory: Record<string, number> } | { ok: false; reason: string } {
  if (!canCook(inventory, recipe)) {
    return { ok: false, reason: '材料が足りない。今は空手。株は残ってるので、また実らせて。' };
  }
  const next = { ...inventory };
  for (const [key, count] of Object.entries(recipe.needs)) {
    next[key] = (next[key] ?? 0) - count;
  }
  next[recipe.id] = (next[recipe.id] ?? 0) + 1;
  return { ok: true, inventory: next };
}
