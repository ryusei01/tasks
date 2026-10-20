import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { companionAction, personality } from '../../src/domain/companion';
import { idleSpeech } from '../../src/domain/dialogue';
import { saltFrom } from '../../src/domain/id';
import { PRODUCE_LABEL } from '../../src/domain/labels';
import { MINIGAMES, minigameUnlocked } from '../../src/domain/minigame';
import { plantView } from '../../src/domain/plant';
import { produceViews } from '../../src/domain/produce';
import { seasonOf } from '../../src/domain/season';
import { computeSignals } from '../../src/domain/signals';
import { slimeFromSignals } from '../../src/domain/slime';
import { canSpecimen, livingGene } from '../../src/domain/synthesis';
import { completionCount, latestDifficulty } from '../../src/domain/tasks';
import { dateKey } from '../../src/domain/time';
import { screen } from '../../src/components/screen';
import { ShareCard, type ShareCardRef } from '../../src/components/ShareCard';
import { CompanionSprite } from '../../src/components/svg/CompanionSprite';
import { FlowerSprite } from '../../src/components/svg/FlowerSprite';
import { ProduceSprite } from '../../src/components/svg/ProduceSprite';
import { SeasonMark } from '../../src/components/svg/SlimeSprite';
import { SlimeSprite } from '../../src/components/svg/SlimeSprite';
import { Button, Chip, Speech } from '../../src/components/ui';
import { useShareCard } from '../../src/components/useShareCard';
import { useRecordDiscoveries } from '../../src/store/useDiscoveries';
import { useGame } from '../../src/store/useGame';

const PREVIEW = [0, 0.25, 0.5, 0.75, 1] as const;

export default function GardenScreen() {
  const tasks = useGame((state) => state.tasks);
  const meal = useGame((state) => state.meal);
  const lastSpeech = useGame((state) => state.lastSpeech);
  const harvestedOn = useGame((state) => state.harvestedOn);
  const harvest = useGame((state) => state.harvest);
  const keepSpecimen = useGame((state) => state.keepSpecimen);
  const [preview, setPreview] = useState<number | null>(null);
  const [showCard, setShowCard] = useState(false);
  const now = Date.now();
  const signals = useMemo(() => computeSignals(tasks, now), [tasks, now]);
  const realPlant = plantView(signals);
  const plant = preview === null ? realPlant : plantView(signals, preview);
  const produce = produceViews(signals);
  const genes = slimeFromSignals(signals);
  const person = personality(signals);
  const season = seasonOf(now);
  const fedToday = meal?.date === signals.todayKey;
  const action = companionAction(signals, fedToday);
  const speech =
    lastSpeech && dateKey(lastSpeech.at) === signals.todayKey
      ? lastSpeech.text
      : idleSpeech(signals, latestDifficulty(tasks), saltFrom(signals.todayKey + 'garden'));
  const cardRef = useRef<ShareCardRef>(null);
  const { share, note } = useShareCard(cardRef, signals, speech);
  const done = completionCount(tasks);
  useRecordDiscoveries(true);

  return (
    <SafeAreaView style={screen.page} edges={['top']}>
    <ScrollView contentContainerStyle={screen.scroll}>
      <View style={screen.column}>
        <Text style={screen.title}>庭</Text>
        <Text style={screen.sub}>
          {season.name}。{season.plantName}と{season.visitorName}が来ている。見逃しても、次の{season.name}にまた来る。
        </Text>
        <Speech text={speech} />
        <View style={screen.row}>
          <SeasonMark hue={season.plantHue} kind="plant" />
          <SeasonMark hue={season.plantHue} kind="visitor" />
        </View>
        <FlowerSprite plant={plant} width={240} />
        <Text style={screen.body}>{plant.caption}</Text>
        <Text style={screen.label}>この達成率だと（プレビュー。セーブしない）</Text>
        <View style={screen.row}>
          <Chip label="実際" selected={preview === null} onPress={() => setPreview(null)} />
          {PREVIEW.map((rate) => (
            <Chip
              key={rate}
              label={`${Math.round(rate * 100)}%`}
              selected={preview === rate}
              onPress={() => setPreview(rate)}
            />
          ))}
        </View>
        <View style={screen.row}>
          <CompanionSprite action={action} width={130} />
          <SlimeSprite genes={genes} width={120} />
        </View>
        <Text style={screen.body}>相棒の性格: {person.label}</Text>
        <Text style={screen.muted}>
          まじめ {person.earnest}　げんき {person.lively}　おっとり {person.gentle}　こだわり {person.particular}　甘え {person.clingy}
        </Text>
        <View style={screen.row}>
          {produce.map((item) => (
            <View key={item.kind} style={{ alignItems: 'center', width: 110 }}>
              <ProduceSprite view={item} />
              <Text style={screen.muted}>
                {PRODUCE_LABEL[item.kind]}　{item.ripe ? '収穫できる' : '育ち途中'}
                {harvestedOn[item.kind] === signals.todayKey ? '　今日収穫済' : ''}
              </Text>
              <Button label="収穫" tone="ghost" onPress={() => harvest(item.kind, item.ripe, Date.now())} />
            </View>
          ))}
        </View>
        <View style={screen.row}>
          <Button label="料理" onPress={() => router.push('/cook')} />
          <Button label="合成" tone="ghost" onPress={() => router.push('/synthesize')} />
          <Button
            label={canSpecimen(realPlant) ? '標本にする' : 'まだ標本にできない'}
            tone="ghost"
            onPress={() => {
              if (canSpecimen(realPlant)) keepSpecimen(livingGene(realPlant), Date.now());
            }}
          />
        </View>
        {!canSpecimen(realPlant) ? (
          <Text style={screen.muted}>花が開くか、連続で増えると標本にできる。今は株が育っている途中。</Text>
        ) : null}
        <Text style={screen.h2}>ミニゲーム</Text>
        <Text style={screen.sub}>やらなくても庭は進む。遊んだあとも、株は残る。</Text>
        {MINIGAMES.map((game) => {
          const open = minigameUnlocked(game.id, signals, done);
          return (
            <View key={game.id} style={screen.task}>
              <Text style={screen.body}>{game.name}</Text>
              <Text style={screen.muted}>{open ? game.blurb : game.unlockText}</Text>
              <Button
                label={open ? '遊ぶ' : 'まだ'}
                tone={open ? 'solid' : 'ghost'}
                onPress={() => {
                  if (open) router.push({ pathname: '/minigame/[id]', params: { id: game.id } });
                }}
              />
            </View>
          );
        })}
        <View style={screen.row}>
          <Button label={showCard ? 'カードを閉じる' : '共有カード'} tone="ghost" onPress={() => setShowCard((value) => !value)} />
          {showCard ? <Button label="X / Instagram へ" onPress={() => void share()} /> : null}
        </View>
        {note ? <Text style={screen.sub}>{note}</Text> : null}
        {showCard ? (
          <ShareCard ref={cardRef} plant={realPlant} action={action} genes={genes} signals={signals} speech={speech} />
        ) : null}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
