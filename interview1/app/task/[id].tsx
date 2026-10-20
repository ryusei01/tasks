import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { focusSeconds } from '../../src/domain/signals';
import { CATEGORY_LABEL, DIFFICULTY_LABEL, STATUS_LABEL } from '../../src/domain/labels';
import { formatWhen } from '../../src/domain/time';
import { CATEGORIES, DIFFICULTIES, type Category, type Difficulty } from '../../src/domain/types';
import { screen } from '../../src/components/screen';
import { Button, Chip, Speech } from '../../src/components/ui';
import { useGame } from '../../src/store/useGame';

export default function TaskScreen() {
  const { id: raw } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(raw) ? raw[0] : raw;
  const task = useGame((state) => state.tasks.find((item) => item.id === id));
  const updateTask = useGame((state) => state.updateTask);
  const removeTask = useGame((state) => state.removeTask);
  const addFocus = useGame((state) => state.addFocus);
  const startTask = useGame((state) => state.startTask);
  const completeTask = useGame((state) => state.completeTask);
  const restTask = useGame((state) => state.restTask);
  const lastSpeech = useGame((state) => state.lastSpeech);
  const [title, setTitle] = useState(task?.title ?? '');
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [armDelete, setArmDelete] = useState(false);

  useEffect(() => {
    if (task) setTitle(task.title);
  }, [task]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);

  if (!task) {
    return (
      <View style={[screen.page, { padding: 20 }]}>
        <Text style={screen.body}>タスクが見つからない。</Text>
        <Button label="戻る" onPress={() => router.back()} />
      </View>
    );
  }

  const total = focusSeconds(task) + elapsed;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  function stopTimer() {
    if (elapsed > 0 && id) addFocus(id, elapsed, Date.now());
    setElapsed(0);
    setRunning(false);
  }

  return (
    <ScrollView style={screen.page} contentContainerStyle={screen.scroll}>
      <View style={screen.column}>
        <Text style={screen.muted}>{STATUS_LABEL[task.status]}</Text>
        <TextInput
          value={title}
          onChangeText={(value) => {
            setTitle(value);
            if (id) updateTask(id, { title: value });
          }}
          style={screen.input}
        />
        {lastSpeech ? <Speech text={lastSpeech.text} /> : null}
        <Text style={screen.h2}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>
        <Text style={screen.muted}>集中タイマー。長く座ると、相棒が一緒に勉強する。</Text>
        <View style={screen.row}>
          <Button
            label={running ? '一時停止' : '着手'}
            onPress={() => {
              if (!id) return;
              if (running) {
                stopTimer();
                return;
              }
              startTask(id, Date.now());
              setRunning(true);
            }}
          />
          <Button
            label="完了"
            onPress={() => {
              if (!id) return;
              stopTimer();
              completeTask(id, Date.now());
            }}
          />
          <Button
            label="休息"
            tone="ghost"
            onPress={() => {
              if (!id) return;
              stopTimer();
              restTask(id, Date.now());
            }}
          />
        </View>
        <Text style={screen.label}>区分</Text>
        <View style={screen.row}>
          {CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={CATEGORY_LABEL[item]}
              selected={task.category === item}
              onPress={() => id && updateTask(id, { category: item as Category })}
            />
          ))}
        </View>
        <Text style={screen.label}>難易度</Text>
        <View style={screen.row}>
          {DIFFICULTIES.map((item) => (
            <Chip
              key={item}
              label={DIFFICULTY_LABEL[item]}
              selected={task.difficulty === item}
              onPress={() => id && updateTask(id, { difficulty: item as Difficulty })}
            />
          ))}
        </View>
        <Text style={screen.muted}>{task.dueAt ? `期限 ${formatWhen(task.dueAt)}` : '期限なし'}</Text>
        <Button
          label={armDelete ? '本当に消す' : '削除'}
          tone="ghost"
          onPress={() => {
            if (!armDelete) {
              setArmDelete(true);
              return;
            }
            if (id) removeTask(id);
            router.back();
          }}
        />
      </View>
    </ScrollView>
  );
}
