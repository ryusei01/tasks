import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export const screen = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: 20, gap: 16, paddingBottom: 120, alignItems: 'center' },
  column: { width: '100%', maxWidth: 560, gap: 16 },
  title: { fontSize: 32, color: colors.ink, fontWeight: '600' },
  sub: { color: colors.inkSoft, fontSize: 14, lineHeight: 21 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  label: { color: colors.inkSoft, fontSize: 13 },
  h2: { fontSize: 18, color: colors.ink, fontWeight: '600' },
  body: { color: colors.ink, fontSize: 15, lineHeight: 22 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 16,
  },
  task: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 4,
  },
  muted: { color: colors.inkSoft, fontSize: 13 },
});
