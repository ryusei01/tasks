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
    line: 'すっぱい。相棒が目を細めた。',
  },
  {
    id: 'stew',
    name: 'きのこの煮込み',
    needs: { tomato: 1, mushroom: 1 },
    line: 'あたたかい。一緒に休む顔になった。',
  },
  {
    id: 'jam',
    name: '不思議ジャム',
    needs: { strawberry: 1, mushroom: 1 },
    line: 'きらきらした。創作したくなる顔になった。',
  },
  {
    id: 'soup',
    name: 'トマトスープ',
    needs: { tomato: 2 },
    line: 'ほっとした顔になった。',
  },
  {
    id: 'shortcake',
    name: '小さなショートケーキ',
    needs: { strawberry: 2 },
    line: '甘くて、相棒が跳ねた。',
  },
  {
    id: 'grill',
    name: '焼きキノコ',
    needs: { mushroom: 2 },
    line: 'いい匂い。甘えてきた。',
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
    return { ok: false, reason: '材料が足りない。株は残っているので、また実る。' };
  }
  const next = { ...inventory };
  for (const [key, count] of Object.entries(recipe.needs)) {
    next[key] = (next[key] ?? 0) - count;
  }
  next[recipe.id] = (next[recipe.id] ?? 0) + 1;
  return { ok: true, inventory: next };
}
