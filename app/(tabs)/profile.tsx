import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/src/tokens';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.sub}>Ride history — coming soon</Text>
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
