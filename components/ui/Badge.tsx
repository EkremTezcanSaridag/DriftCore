import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Radius } from '../../constants/spacing';

interface BadgeProps {
  label: string;
  variant?: 'cyan' | 'magenta' | 'amber' | 'violet' | 'gray';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'cyan', icon, style }) => {
  const getBadgeStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.badge];
    if (variant === 'cyan') base.push(styles.cyan);
    else if (variant === 'magenta') base.push(styles.magenta);
    else if (variant === 'amber') base.push(styles.amber);
    else if (variant === 'violet') base.push(styles.violet);
    else if (variant === 'gray') base.push(styles.gray);
    if (style) base.push(style);
    return base;
  };

  return (
    <View style={getBadgeStyle()}>
      {icon}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  cyan: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderColor: Colors.primary,
  },
  magenta: {
    backgroundColor: 'rgba(255, 0, 127, 0.15)',
    borderColor: Colors.secondary,
  },
  amber: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderColor: Colors.warning,
  },
  violet: {
    backgroundColor: 'rgba(112, 0, 255, 0.15)',
    borderColor: Colors.accent,
  },
  gray: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
  },
  text: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    letterSpacing: Typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
});
