import { plantView } from './plant';
import { seasonOf } from './season';
import { unlockedSecrets } from './secrets';
import { computeSignals } from './signals';
import { slimeFromSignals, slimeId } from './slime';
import type { FlowerGene, Task } from './types';

export function discoveryIds(
  tasks: Task[],
  nursery: FlowerGene[],
  cooked: string[],
  now: number,
  withSeason: boolean,
): string[] {
  const signals = computeSignals(tasks, now);
  const plant = plantView(signals);
  const ids = [
    slimeId(slimeFromSignals(signals)),
    `flower:form:${plant.stage}:${plant.mutation ?? 'plain'}`,
    ...unlockedSecrets(signals).map((secret) => secret.id),
    ...nursery.map((gene) => gene.id),
    ...cooked.map((id) => `dish:${id}`),
  ];
  if (withSeason) {
    const season = seasonOf(now);
    ids.push(season.plantId, season.visitorId);
  }
  return ids;
}
