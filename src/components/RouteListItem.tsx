import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../tokens';
import { LaneType, laneConfig } from '../utils/laneColor';

type Direction = 'straight' | 'left' | 'right';

interface Props {
  type: LaneType;
  direction: Direction;
  street: string;
  distance: string;
}

const directionIcon: Record<Direction, React.ComponentProps<typeof FontAwesome>['name']> = {
  straight: 'arrow-up',
  left:     'arrow-left',
  right:    'arrow-right',
};

export default function RouteListItem({ type, direction, street, distance }: Props) {
  const config = laneConfig[type];

  return (
    <View style={styles.row}>
      <View style={[styles.accent, { backgroundColor: config.color }]} />
      <View style={[styles.iconCircle, { backgroundColor: config.lightBg }]}>
        <FontAwesome name={directionIcon[direction]} size={14} color={config.color} />
      </View>
      <View style={styles.text}>
        <Text style={styles.street}>{street}</Text>
        <Text style={styles.distance}>{distance}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  accent: {
    width: 3,
    height: '100%',
    borderRadius: radius.full,
    minHeight: 40,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  street: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  distance: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
});
