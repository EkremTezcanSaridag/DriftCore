import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { useGameStore } from '../../store/useGameStore';

interface GameHUDProps {
  onPausePress: () => void;
  comboMultiplier?: number;
  shardsCollected?: number;
  totalShards?: number;
  coinsSession?: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  onPausePress,
  comboMultiplier = 1,
  shardsCollected = 0,
  totalShards = 5,
  coinsSession = 0,
}) => {
  const score = useGameStore((state) => state.score);

  return (
    <View style={styles.container}>
      {/* Score & Combo */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreTopRow}>
          <Text style={styles.scoreLabel}>SKOR</Text>
          {comboMultiplier > 1 && (
            <View style={styles.comboBadge}>
              <Text style={styles.comboText}>x{comboMultiplier} COMBO</Text>
            </View>
          )}
        </View>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      {/* Center Collectibles Stats */}
      <View style={styles.centerSection}>
        {/* Shards Indicator */}
        <View style={styles.collectiblePill}>
          <Ionicons name="diamond" size={13} color={Colors.primary} />
          <Text style={styles.collectibleText}>
            {shardsCollected}/{totalShards}
          </Text>
        </View>

        {/* Coins Indicator */}
        <View style={[styles.collectiblePill, styles.coinPill]}>
          <Ionicons name="flash" size={13} color={Colors.warning} />
          <Text style={[styles.collectibleText, styles.coinText]}>+{coinsSession}</Text>
        </View>
      </View>

      {/* Pause Button */}
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
    zIndex: 100,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  scoreTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
  comboBadge: {
    backgroundColor: 'rgba(255, 0, 127, 0.25)',
    borderColor: Colors.secondary,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  comboText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.black,
    color: Colors.primary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collectiblePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderColor: Colors.primaryGlow,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  collectibleText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  coinPill: {
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderColor: Colors.warning,
  },
  coinText: {
    color: Colors.warning,
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
