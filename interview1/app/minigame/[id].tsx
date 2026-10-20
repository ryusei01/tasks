import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { minigameById, minigameUnlocked } from '../../src/domain/minigame';
import { computeSignals } from '../../src/domain/signals';
import { slimeFromSignals } from '../../src/domain/slime';
import { completionCount } from '../../src/domain/tasks';
import { screen } from '../../src/components/screen';
import { SlimeSprite } from '../../src/components/svg/SlimeSprite';
import { Button, Speech } from '../../src/components/ui';
import { useGame } from '../../src/store/useGame';

export default function MinigameScreen() {
  const { id: raw } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(raw) ? raw[0] : raw;
  const game = minigameById(id ?? '');
  const tasks = useGame((state) => state.tasks);
  const finishMinigame = useGame((state) => state.finishMinigame);
  const lastSpeech = useGame((state) => state.lastSpeech);
  const signals = useMemo(() => computeSignals(tasks, Date.now()), [tasks]);
  const open = game ? minigameUnlocked(game.id, signals, completionCount(tasks)) : false;
  const [taps, setTaps] = useState(0);
  const [leaves, setLeaves] = useState([0, 1, 2, 3, 4, 5]);
  const [done, setDone] = useState(false);
  const genes = slimeFromSignals(signals);
  const goal = game?.id === 'water' ? 8 : game?.id === 'bounce' ? 10 : 6;

  function finish() {
    if (done || !game) return;
    setDone(true);
    finishMinigame(game.id, Date.now());
  }

  if (!game) {
    return (
      <View style={[screen.page, { padding: 20 }]}>
        <Text style={screen.body}>遊びが見つからない。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={screen.page} contentContainerStyle={screen.scroll}>
      <View style={screen.column}>
        <Text style={screen.title}>{game.name}</Text>
        <Text style={screen.sub}>{open ? game.blurb : game.unlockText}</Text>
        {lastSpeech && done ? <Speech text={lastSpeech.text} /> : null}
        {!open ? null : game.id === 'harvest' ? (
          <View style={screen.row}>
            {leaves.map((leaf) => (
              <Pressable
                key={leaf}
                onPress={() => {
                  const next = leaves.filter((item) => item !== leaf);
                  setLeaves(next);
                  if (next.length === 0) finish();
                }}
                style={screen.task}
              >
                <Text style={screen.body}>実</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', gap: 12 }}>
            {game.id === 'bounce' ? <SlimeSprite genes={genes} bounce={taps * 2} width={160} /> : null}
            <Text style={screen.h2}>
              {taps} / {goal}
            </Text>
            <Button
              label={game.id === 'water' ? '水をやる' : 'はずませる'}
              onPress={() => {
                const next = taps + 1;
                setTaps(next);
                if (next >= goal) finish();
              }}
            />
          </View>
        )}
        {done ? <Text style={screen.sub}>遊び終わった。庭の成長には影響しない。</Text> : null}
      </View>
    </ScrollView>
  );
}
