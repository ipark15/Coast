import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../tokens';

interface Props {
  label: string;
  children: React.ReactNode;
}

export default function InfoCard({ label, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  content: {
    gap: spacing.xs,
  },
});
