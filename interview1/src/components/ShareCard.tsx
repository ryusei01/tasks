import { forwardRef, type ComponentRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CompanionAction, PlantView, Signals, SlimeGenes } from '../domain/types';
import { colors } from '../theme';
import { CompanionSprite } from './svg/CompanionSprite';
import { FlowerSprite } from './svg/FlowerSprite';
import { SlimeSprite } from './svg/SlimeSprite';

export type ShareCardRef = ComponentRef<typeof View>;

export const ShareCard = forwardRef<
  ShareCardRef,
  { plant: PlantView; action: CompanionAction; genes: SlimeGenes; signals: Signals; speech: string }
>(function ShareCard({ plant, action, genes, signals, speech }, ref) {
  const rate = signals.todayRate == null ? '期限つきタスクなし' : `達成率 ${Math.round(signals.todayRate * 100)}%`;
  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      <Text style={styles.brand}>はなこと</Text>
      <FlowerSprite plant={plant} width={180} />
      <View style={styles.row}>
        <CompanionSprite action={action} width={110} />
        <SlimeSprite genes={genes} width={110} />
      </View>
      <Text style={styles.speech}>{speech}</Text>
      <Text style={styles.meta}>
        {rate}　連続 {signals.streak}日
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 340,
    backgroundColor: colors.paper,
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  brand: {
    color: colors.mossDeep,
    fontSize: 18,
    letterSpacing: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  speech: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  meta: {
    color: colors.inkSoft,
    fontSize: 13,
  },
});
