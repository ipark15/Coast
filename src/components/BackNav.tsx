import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors, spacing, typography } from '../tokens';

interface Props {
  label: string;
  onPress: () => void;
}

export default function BackNav({ label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.text}>{'< '}{label.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  text: {
    ...typography.label,
    color: colors.teal,
    letterSpacing: 0.8,
  },
});
