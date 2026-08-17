import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { useGameStore } from '../../store/useGameStore';

export const StatDisplay: React.FC = () => {
  const highScore = useGameStore((state) => state.highScore);
  const coins = useGameStore((state) => state.coins);

  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Ionicons name="trophy" size={16} color={Colors.warning} />
        <Text style={styles.val}>{highScore}</Text>
      </View>

      <View style={styles.pill}>
        <Ionicons name="flash" size={16} color={Colors.primary} />
        <Text style={styles.val}>{coins}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  val: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
});
