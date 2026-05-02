import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../tokens';

interface Props {
  message: string;
}

export default function PlaceholderCard({ message }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  text: {
    ...typography.bodySmall,
    color: colors.teal,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
