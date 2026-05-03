import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '../tokens';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'teal' | 'dark';
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  style?: ViewStyle;
}

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'teal',
  icon,
  style,
}: Props) {
  const bg = variant === 'dark' ? colors.headerDark : colors.teal;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg }, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={styles.label}>{label}</Text>
      {icon && <FontAwesome name={icon} size={14} color={colors.surface} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
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
    color: colors.surface,
  },
});
