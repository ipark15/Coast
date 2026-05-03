import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '../tokens';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  style?: ViewStyle;
}

export default function GhostButton({ label, onPress, disabled = false, icon, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <FontAwesome name={icon} size={14} color={colors.teal} />}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: colors.teal,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...typography.subheading,
    color: colors.teal,
  },
});
