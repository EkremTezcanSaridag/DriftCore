/**
 * DriftCore — Typography Scale & Font System
 */
export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 36,
    display: 48,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 1.2,
    wider: 2.5,
    arcade: 4.0,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    hero: 44,
  },
} as const;
