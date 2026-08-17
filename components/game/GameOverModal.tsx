import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  highScore: number;
  isNewHighScore?: boolean;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  highScore,
  isNewHighScore = false,
  onRestart,
  onMainMenu,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      hardwareAccelerated
    >
      <View style={styles.overlay}>
        <Card variant="secondary" style={styles.modalCard}>
          {/* Header Badge */}
          <View style={styles.headerRow}>
            <View style={styles.dangerIconContainer}>
              <Ionicons name="close-circle" size={36} color={Colors.secondary} />
            </View>
            <Text style={styles.title}>GAME OVER</Text>
          </View>

          {isNewHighScore && (
            <View style={styles.badgeRow}>
              <Badge
                label="YENİ REKOR!"
                variant="amber"
                icon={<Ionicons name="trophy" size={14} color={Colors.warning} />}
              />
            </View>
          )}

          {/* Scores Breakdown */}
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>SKOR</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>EN YÜKSEK</Text>
              <Text style={styles.highScoreValue}>{highScore}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsColumn}>
            <Button
              title="TEKRAR OYNA"
              onPress={onRestart}
              variant="primary"
              size="large"
              icon={<Ionicons name="refresh-sharp" size={20} color={Colors.surface} />}
              style={styles.fullWidthBtn}
            />

            <Button
              title="ANA MENÜ"
              onPress={onMainMenu}
              variant="outline"
              size="medium"
              icon={<Ionicons name="home-outline" size={18} color={Colors.primary} />}
              style={styles.fullWidthBtn}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.secondary,
    borderWidth: 1.5,
    borderRadius: Radius.xl,
  },
  headerRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dangerIconContainer: {
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.black,
    color: Colors.secondary,
    letterSpacing: Typography.letterSpacing.arcade,
  },
  badgeRow: {
    marginBottom: Spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: Colors.backgroundSecondary,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  highScoreValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.warning,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: Colors.border,
  },
  actionsColumn: {
    width: '100%',
    gap: Spacing.md,
  },
  fullWidthBtn: {
    width: '100%',
  },
});
