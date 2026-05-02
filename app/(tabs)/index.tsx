import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/src/tokens';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.sub}>Home screen — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  sub: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 8,
  },
});
