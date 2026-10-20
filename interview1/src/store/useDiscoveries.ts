import { useEffect } from 'react';
import { discoveryIds } from '../domain/discoveries';
import { useGame } from './useGame';

export function useRecordDiscoveries(withSeason: boolean) {
  const tasks = useGame((state) => state.tasks);
  const nursery = useGame((state) => state.nursery);
  const cooked = useGame((state) => state.cooked);
  const discover = useGame((state) => state.discover);

  useEffect(() => {
    discover(discoveryIds(tasks, nursery, cooked, Date.now(), withSeason));
  }, [cooked, discover, nursery, tasks, withSeason]);
}
