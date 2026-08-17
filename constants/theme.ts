import { Colors } from './colors';
import { Typography } from './typography';
import { Spacing, Radius, Layout } from './spacing';

/**
 * Central Theme Object for DriftCore Application
 */
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  layout: Layout,
} as const;

export type ThemeType = typeof Theme;
