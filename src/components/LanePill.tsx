import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../tokens';
import { LaneType, laneConfig } from '../utils/laneColor';

interface Props {
  type: LaneType;
  distance?: string;
  variant?: 'filled' | 'outlined';
}

export default function LanePill({ type, distance, variant = 'filled' }: Props) {
  const config = laneConfig[type];
  const isOutlined = variant === 'outlined';

  return (
    <View
      style={[
        styles.pill,
        isOutlined
          ? { borderColor: config.color, borderWidth: 1.5, backgroundColor: 'transparent' }
          : { backgroundColor: config.lightBg },
      ]}
    >
      <Text style={[styles.dot, { color: config.color }]}>● </Text>
      <Text style={[styles.label, { color: config.color }]}>
        {config.label}{distance ? ` · ${distance}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
  },
  dot: {
    fontSize: 8,
    lineHeight: 14,
  },
  label: {
    ...typography.label,
    letterSpacing: 0,
    fontSize: 12,
  },
});
