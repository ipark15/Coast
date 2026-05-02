import { StyleSheet, View } from 'react-native';

import { colors, radius } from '../tokens';

interface Props {
  safe: number;
  caution: number;
  hard: number;
}

export default function SafetyBar({ safe, caution, hard }: Props) {
  return (
    <View style={styles.track}>
      {safe > 0 && (
        <View style={[styles.segment, { flex: safe, backgroundColor: colors.safe }]} />
      )}
      {caution > 0 && (
        <View style={[styles.segment, { flex: caution, backgroundColor: colors.caution }]} />
      )}
      {hard > 0 && (
        <View style={[styles.segment, { flex: hard, backgroundColor: colors.hard }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 8,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
});
