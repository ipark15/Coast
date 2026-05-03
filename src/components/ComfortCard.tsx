import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '../tokens';
import { LaneType, laneConfig } from '../utils/laneColor';

const ICONS: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
  avoid:       'tree',
  some:        'code-fork',
  comfortable: 'bolt',
};

interface Props {
  id: string;
  title: string;
  badge: string;
  badgeType: LaneType;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function ComfortCard({ id, title, badge, badgeType, description, selected, onPress }: Props) {
  const badgeColor = laneConfig[badgeType].color;
  const badgeBg   = laneConfig[badgeType].lightBg;
  const icon       = ICONS[id] ?? 'circle';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <FontAwesome name={icon} size={16} color={selected ? colors.teal : colors.textMuted} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badge.toUpperCase()}</Text>
        </View>
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconWrapSelected: {
    backgroundColor: colors.tealLight,
  },

  body: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textMuted,
    lineHeight: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.xs,
  },
  badgeText: {
    ...typography.label,
    fontSize: 10,
    letterSpacing: 0.5,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  radioSelected: {
    borderColor: colors.teal,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.teal,
  },
});
