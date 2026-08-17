import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'surface' | 'neon' | 'secondary' | 'dark';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'surface' }) => {
  const getCardStyle = (): StyleProp<ViewStyle> => {
    const base: StyleProp<ViewStyle>[] = [styles.card];
    if (variant === 'neon') base.push(styles.neon);
    else if (variant === 'secondary') base.push(styles.secondary);
    else if (variant === 'dark') base.push(styles.dark);
    if (style) base.push(style);
    return base;
  };

  return <View style={getCardStyle()}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  neon: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dark: {
    backgroundColor: Colors.backgroundSecondary,
    borderColor: Colors.border,
  },
});
