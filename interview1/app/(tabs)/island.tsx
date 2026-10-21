import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { computeSignals } from '../../src/domain/signals';
import { worldRows, worldView } from '../../src/domain/world';
import { screen } from '../../src/components/screen';
import { IslandSvg } from '../../src/components/svg/IslandSvg';
import { useRecordDiscoveries } from '../../src/store/useDiscoveries';
import { useGame } from '../../src/store/useGame';

export default function IslandScreen() {
  const tasks = useGame((state) => state.tasks);
  const now = Date.now();
  const signals = useMemo(() => computeSignals(tasks, now), [tasks, now]);
  const world = worldView(signals);
  const rows = worldRows(world);
  useRecordDiscoveries(false);

  return (
    <SafeAreaView style={screen.page} edges={['top']}>
    <ScrollView contentContainerStyle={screen.scroll}>
      <View style={screen.column}>
        <Text style={screen.title}>島</Text>
        <Text style={screen.sub}>運動で森、勉強で図書館、家事で道。土地が、やったことの形で調子に乗る。</Text>
        <IslandSvg world={world} width={340} />
        {rows.map((row) => (
          <View key={row.key} style={screen.task}>
            <Text style={screen.body}>{row.label}</Text>
            <Text style={screen.muted}>{row.detail}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
