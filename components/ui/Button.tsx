import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Radius } from '../../constants/spacing';
import { useSettingsStore } from '../../store/useSettingsStore';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const hapticsEnabled = useSettingsStore((state) => state.hapticsEnabled);

  const handlePress = () => {
    if (disabled || loading) return;
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const base: StyleProp<ViewStyle>[] = [styles.button, styles[`size_${size}`]];

    if (variant === 'primary') base.push(styles.variant_primary);
    else if (variant === 'secondary') base.push(styles.variant_secondary);
    else if (variant === 'outline') base.push(styles.variant_outline);
    else if (variant === 'ghost') base.push(styles.variant_ghost);

    if (disabled) base.push(styles.disabled);
    if (style) base.push(style);

    return base;
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const base: StyleProp<TextStyle>[] = [styles.text, styles[`textSize_${size}`]];

    if (variant === 'primary') base.push(styles.text_primary);
    else if (variant === 'secondary') base.push(styles.text_secondary);
    else if (variant === 'outline') base.push(styles.text_outline);
    else if (variant === 'ghost') base.push(styles.text_ghost);

    if (disabled) base.push(styles.text_disabled);
    if (textStyle) base.push(textStyle);

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      disabled={disabled || loading}
      style={getContainerStyle()}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.background}
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    gap: 8,
  },
  size_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  size_medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  size_large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  variant_primary: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  variant_secondary: {
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  variant_ghost: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabled: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  },
  text: {
    fontWeight: Typography.weights.bold,
    letterSpacing: Typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  textSize_small: {
    fontSize: Typography.sizes.xs,
  },
  textSize_medium: {
    fontSize: Typography.sizes.sm,
  },
  textSize_large: {
    fontSize: Typography.sizes.md,
  },
  text_primary: {
    color: Colors.background,
  },
  text_secondary: {
    color: Colors.text,
  },
  text_outline: {
    color: Colors.primary,
  },
  text_ghost: {
    color: Colors.textSecondary,
  },
  text_disabled: {
    color: Colors.textMuted,
  },
});
