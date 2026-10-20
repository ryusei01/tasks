import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function Speech({ text }: { text: string }) {
  return (
    <View style={styles.bubble}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipOn : null]}
    >
      <Text style={[styles.chipText, selected ? styles.chipTextOn : null]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function Button({
  label,
  onPress,
  tone = 'solid',
}: {
  label: string;
  onPress: () => void;
  tone?: 'solid' | 'ghost';
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={tone === 'solid' ? styles.button : styles.ghost}>
      <Text style={tone === 'solid' ? styles.buttonText : styles.ghostText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipOn: {
    backgroundColor: colors.moss,
    borderColor: colors.moss,
  },
  chipText: {
    color: colors.ink,
    fontSize: 13,
  },
  chipTextOn: {
    color: colors.white,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 12,
  },
  button: {
    backgroundColor: colors.moss,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  buttonText: { color: colors.white, fontSize: 15 },
  ghost: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
  },
  ghostText: { color: colors.ink, fontSize: 15 },
});
