/**
 * DriftCore — Futuristic Neon & Obsidian Theme Palette
 */
export const Colors = {
  // Deep dark obsidian backgrounds
  background: '#0B0F19',
  backgroundSecondary: '#111827',
  surface: '#131B2E',
  surfaceLight: '#1E293B',
  surfaceHighlight: '#26334D',

  // Neon Accent Colors
  primary: '#00F0FF',        // Cyber Cyan (Core Energy)
  primaryGlow: 'rgba(0, 240, 255, 0.35)',
  secondary: '#FF007F',      // Neon Magenta (Energy Shards)
  secondaryGlow: 'rgba(255, 0, 127, 0.35)',
  accent: '#7000FF',         // Electric Violet (Boost / Special)
  accentGlow: 'rgba(112, 0, 255, 0.35)',
  warning: '#FFB800',        // Solar Amber (Alerts / Stars)
  warningGlow: 'rgba(255, 184, 0, 0.35)',
  success: '#00FF66',        // Acid Green (Success)

  // Neutral Text & Icons
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDisabled: '#475569',

  // Borders & Glow outlines
  border: '#1E293B',
  borderLight: '#334155',
  borderNeon: '#00F0FF',
  borderSecondary: '#FF007F',

  // Overlay & Shadows
  overlay: 'rgba(11, 15, 25, 0.85)',
  cardShadow: 'rgba(0, 240, 255, 0.15)',
} as const;

export type ColorType = typeof Colors;
