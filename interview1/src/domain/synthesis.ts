import type { FlowerGene, PlantView } from './types';

export function livingGene(plant: PlantView): FlowerGene {
  const name =
    plant.mutation === 'moon_lotus'
      ? '月下の青蓮'
      : plant.mutation === 'gold'
        ? '早暁の金花'
        : plant.mutation === 'spectrum'
          ? '五日の花'
          : '今の花';
  return {
    id: `living:${plant.mutation ?? plant.stage}:${plant.hue}`,
    name,
    hueA: plant.hue,
    hueB: plant.hueB,
    petals: plant.petals,
    leaf: plant.curled ? 'curl' : plant.stage === 'bloom' ? 'long' : 'round',
    glow: plant.glow,
    moon: plant.moonlit,
  };
}

export function canSpecimen(plant: PlantView): boolean {
  return plant.stage === 'bloom' || plant.fruit || plant.flowerCount >= 2 || plant.mutation != null;
}

export function mixFlower(parentA: FlowerGene, parentB: FlowerGene, salt: string): FlowerGene {
  const petals = Math.min(8, Math.max(4, Math.round((parentA.petals + parentB.petals) / 2)));
  let leaf: FlowerGene['leaf'] = 'long';
  if (parentA.leaf === 'curl' || parentB.leaf === 'curl') leaf = 'curl';
  else if (parentA.leaf === parentB.leaf) leaf = parentA.leaf;
  return {
    id: `mix:${salt}`,
    name: `${parentA.name}と${parentB.name}`,
    hueA: parentA.hueA,
    hueB: parentB.hueB,
    petals,
    leaf,
    glow: parentA.glow || parentB.glow,
    moon: parentA.moon || parentB.moon,
  };
}
