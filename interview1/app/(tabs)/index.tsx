import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { idleSpeech } from '../../src/domain/dialogue';
import { saltFrom } from '../../src/domain/id';
import { CATEGORY_LABEL, DIFFICULTY_LABEL, STATUS_LABEL } from '../../src/domain/labels';
import { plantView } from '../../src/domain/plant';
import { companionAction } from '../../src/domain/companion';
import { computeSignals } from '../../src/domain/signals';
import { slimeFromSignals } from '../../src/domain/slime';
import { completionCount, duePreset, latestDifficulty, tasksForToday } from '../../src/domain/tasks';
import { dateKey, formatWhen } from '../../src/domain/time';
import { CATEGORIES, DIFFICULTIES, type Category, type Difficulty } from '../../src/domain/types';
import { RateGauge } from '../../src/components/RateGauge';
import { screen } from '../../src/components/screen';
import { ShareCard, type ShareCardRef } from '../../src/components/ShareCard';
import { FlowerSprite } from '../../src/components/svg/FlowerSprite';
import { Button, Chip, Speech } from '../../src/components/ui';
import { useShareCard } from '../../src/components/useShareCard';
import { useRecordDiscoveries } from '../../src/store/useDiscoveries';
import { useGame } from '../../src/store/useGame';

export default function TodayScreen() {
  const tasks = useGame((state) => state.tasks);
  const lastSpeech = useGame((state) => state.lastSpeech);
  const meal = useGame((state) => state.meal);
  const addTask = useGame((state) => state.addTask);
  const now = Date.now();
  const signals = useMemo(() => computeSignals(tasks, now), [tasks, now]);
  const plant = plantView(signals);
  const genes = slimeFromSignals(signals);
  const fedToday = meal?.date === signals.todayKey;
  const action = companionAction(signals, fedToday);
  const speech =
    lastSpeech && dateKey(lastSpeech.at) === signals.todayKey
      ? lastSpeech.text
      : idleSpeech(signals, latestDifficulty(tasks), saltFrom(signals.todayKey));
  const visible = tasksForToday(tasks, now);
  const cardRef = useRef<ShareCardRef>(null);
  const { share, note } = useShareCard(cardRef, signals, speech);
  const [showCard, setShowCard] = useState(false);
  useRecordDiscoveries(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('study');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [dueKind, setDueKind] = useState<'none' | 'tonight' | 'tomorrow' | 'later'>('tonight');

  return (
    <SafeAreaView style={screen.page} edges={['top']}>
    <ScrollView contentContainerStyle={screen.scroll}>
      <View style={screen.column}>
        <Text style={screen.title}>はなこと</Text>
        <Text style={screen.sub}>取り組むと、花と相棒と島が変わる。終わらなくても、枯れない。</Text>
        <Speech text={speech} />
        <FlowerSprite plant={plant} width={220} />
        <RateGauge rate={signals.todayRate} />
        <Text style={screen.muted}>
          連続 {signals.streak}日　完了 {completionCount(tasks)}　性格は庭で育つ
        </Text>
        <View style={screen.row}>
          <Button label={showCard ? 'カードを閉じる' : '共有カード'} onPress={() => setShowCard((value) => !value)} tone="ghost" />
          {showCard ? <Button label="X / Instagram へ" onPress={() => void share()} /> : null}
        </View>
        {note ? <Text style={screen.sub}>{note}</Text> : null}
        {showCard ? <ShareCard ref={cardRef} plant={plant} action={action} genes={genes} signals={signals} speech={speech} /> : null}

        <Text style={screen.h2}>タスクを足す</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="今日やること"
          placeholderTextColor="#8a9488"
          style={screen.input}
        />
        <Text style={screen.label}>区分</Text>
        <View style={screen.row}>
          {CATEGORIES.map((item) => (
            <Chip key={item} label={CATEGORY_LABEL[item]} selected={category === item} onPress={() => setCategory(item)} />
          ))}
        </View>
        <Text style={screen.label}>難易度（言葉の厳しさ）</Text>
        <View style={screen.row}>
          {DIFFICULTIES.map((item) => (
            <Chip key={item} label={DIFFICULTY_LABEL[item]} selected={difficulty === item} onPress={() => setDifficulty(item)} />
          ))}
        </View>
        <Text style={screen.label}>期限</Text>
        <View style={screen.row}>
          <Chip label="なし" selected={dueKind === 'none'} onPress={() => setDueKind('none')} />
          <Chip label="今日の夜" selected={dueKind === 'tonight'} onPress={() => setDueKind('tonight')} />
          <Chip label="明日" selected={dueKind === 'tomorrow'} onPress={() => setDueKind('tomorrow')} />
          <Chip label="3日後" selected={dueKind === 'later'} onPress={() => setDueKind('later')} />
        </View>
        <Button
          label="追加する"
          onPress={() => {
            const trimmed = title.trim();
            if (!trimmed) return;
            addTask({ title: trimmed, category, difficulty, dueAt: duePreset(dueKind, Date.now()), now: Date.now() });
            setTitle('');
          }}
        />

        <Text style={screen.h2}>今日</Text>
        {visible.length === 0 ? <Text style={screen.sub}>今日のタスクはまだない。一つ置くと庭が動く。</Text> : null}
        {visible.map((task) => {
          const overdue = task.dueAt != null && task.dueAt < now && task.status !== 'done' && dateKey(task.dueAt) !== signals.todayKey;
          return (
            <Pressable key={task.id} style={screen.task} onPress={() => router.push({ pathname: '/task/[id]', params: { id: task.id } })}>
              <Text style={screen.body}>{task.title}</Text>
              <Text style={screen.muted}>
                {CATEGORY_LABEL[task.category]}　{DIFFICULTY_LABEL[task.difficulty]}　{STATUS_LABEL[task.status]}
                {task.dueAt ? `　${formatWhen(task.dueAt)}` : ''}
              </Text>
              {overdue ? <Text style={screen.muted}>期限を過ぎている。休んでも枯れない。</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
