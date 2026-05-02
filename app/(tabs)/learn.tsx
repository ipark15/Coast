import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/src/tokens';

export default function LearnScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learn</Text>
      <Text style={styles.sub}>Bicycle Kitchen info — coming soon</Text>
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
