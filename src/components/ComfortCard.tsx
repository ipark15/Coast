import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '../tokens';
import { LaneType, laneConfig } from '../utils/laneColor';

interface Props {
  title: string;
  badge: string;
  badgeType: LaneType;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function ComfortCard({ title, badge, badgeType, description, selected, onPress }: Props) {
  const badgeColor = laneConfig[badgeType].color;
  const badgeBg = laneConfig[badgeType].lightBg;

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
      {selected && <View style={[styles.indicator, { backgroundColor: laneConfig[badgeType].color }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: colors.teal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    borderRadius: radius.full,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
  },
  badgeText: {
    ...typography.label,
    letterSpacing: 0,
    fontSize: 11,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});
