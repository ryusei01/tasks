import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { plantView } from '../src/domain/plant';
import { computeSignals } from '../src/domain/signals';
import { canSpecimen, livingGene } from '../src/domain/synthesis';
import type { FlowerGene } from '../src/domain/types';
import { screen } from '../src/components/screen';
import { FlowerSprite } from '../src/components/svg/FlowerSprite';
import { Button, Speech } from '../src/components/ui';
import { useGame } from '../src/store/useGame';

export default function SynthesizeScreen() {
  const tasks = useGame((state) => state.tasks);
  const nursery = useGame((state) => state.nursery);
  const lastSpeech = useGame((state) => state.lastSpeech);
  const keepSpecimen = useGame((state) => state.keepSpecimen);
  const synthesize = useGame((state) => state.synthesize);
  const signals = useMemo(() => computeSignals(tasks, Date.now()), [tasks]);
  const plant = plantView(signals);
  const living = livingGene(plant);
  const mature = canSpecimen(plant);
  const [picked, setPicked] = useState<string[]>([]);

  function toggle(id: string) {
    setPicked((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return [current[1], id];
      return [...current, id];
    });
  }

  const pool: FlowerGene[] = [...(mature ? [living] : []), ...nursery];
  const selected = picked
    .map((id) => pool.find((gene) => gene.id === id))
    .filter((gene): gene is FlowerGene => Boolean(gene));

  return (
    <ScrollView style={screen.page} contentContainerStyle={screen.scroll}>
      <View style={screen.column}>
        <Text style={screen.title}>合成</Text>
        <Text style={screen.sub}>二株を掛ける。親は残る。失敗して消えることはない。</Text>
        <FlowerSprite plant={plant} width={160} />
        {lastSpeech ? <Speech text={lastSpeech.text} /> : null}
        <Button
          label={mature ? '今の花を標本にする' : 'まだ標本にできない'}
          tone="ghost"
          onPress={() => {
            if (mature) keepSpecimen(living, Date.now());
          }}
        />
        {pool.length === 0 ? <Text style={screen.sub}>標本がまだない。花が開いてから残せる。</Text> : null}
        {pool.map((gene) => {
          const on = picked.includes(gene.id);
          return (
            <Pressable key={gene.id} style={[screen.task, on ? { borderColor: '#3f6b4a' } : null]} onPress={() => toggle(gene.id)}>
              <Text style={screen.body}>
                {on ? '選択中　' : ''}
                {gene.name}
              </Text>
              <Text style={screen.muted}>
                花弁 {gene.petals}
                {gene.glow ? '　光' : ''}
                {gene.moon ? '　月' : ''}
              </Text>
            </Pressable>
          );
        })}
        <Button
          label="掛け合わせる"
          onPress={() => {
            if (selected.length !== 2) return;
            synthesize(selected[0], selected[1], Date.now());
            setPicked([]);
          }}
        />
      </View>
    </ScrollView>
  );
}
