import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { useGameStore } from '../../store/useGameStore';

interface GameHUDProps {
  onPausePress: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onPausePress }) => {
  const score = useGameStore((state) => state.score);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>SKOR</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      <View style={styles.centerSection}>
        <View style={styles.energyPill}>
          <Ionicons name="flash" size={14} color={Colors.primary} />
          <Text style={styles.energyText}>CORE ENERGY: 100%</Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.7} onPress={onPausePress} style={styles.pauseButton}>
        <Ionicons name="pause" size={20} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
  scoreValue: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.black,
    color: Colors.primary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  centerSection: {
    alignItems: 'center',
  },
  energyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderColor: Colors.primaryGlow,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  energyText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  pauseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
