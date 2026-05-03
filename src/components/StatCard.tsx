import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../tokens';

interface Props {
  value: string;
  label: string;
  valueColor?: string;
}

export default function StatCard({ value, label, valueColor }: Props) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  value: {
    ...typography.statNumber,
    color: colors.textPrimary,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: 4,
  },
});
