import { StyleSheet, Text, View } from 'react-native';
import { stageCaption, stageForRate } from '../domain/plant';
import { colors } from '../theme';

export function RateGauge({ rate }: { rate: number | null }) {
  const pct = rate == null ? 0 : Math.max(0, Math.min(100, Math.round(rate * 100)));
  const caption = stageCaption(stageForRate(rate));
  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>成長中</Text>
      <Text style={styles.caption}>{caption}</Text>
      <Text style={styles.rate}>タスク達成率 {rate == null ? '—' : `${pct}%`}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
        <View style={[styles.knob, { left: `${pct}%` }]} />
      </View>
      <View style={styles.ticks}>
        {['0%', '25%', '50%', '75%', '100%'].map((label) => (
          <Text key={label} style={styles.tick}>
            {label}
          </Text>
        ))}
      </View>
      <Text style={styles.note}>休んでも、枯れない。</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  kicker: { color: colors.mossDeep, fontSize: 13, letterSpacing: 1 },
  caption: { color: colors.ink, fontSize: 16, lineHeight: 24 },
  rate: { color: colors.inkSoft, fontSize: 14 },
  track: {
    height: 8,
    borderRadius: 99,
    backgroundColor: colors.paperDeep,
    marginTop: 8,
    position: 'relative',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 99,
    backgroundColor: colors.moss,
  },
  knob: {
    position: 'absolute',
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.moss,
    top: -5,
  },
  ticks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tick: { color: colors.inkSoft, fontSize: 12 },
  note: { color: colors.inkSoft, fontSize: 12 },
});
