import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { GameHUD } from '../components/game/GameHUD';
import { PauseModal } from '../components/game/PauseModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';
import { useGameStore } from '../store/useGameStore';
import { GameState } from '../types/game';

export default function GameScreen() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const { score, incrementScore, resetSession, setGameState } = useGameStore();

  const handlePause = () => {
    setIsPaused(true);
    setGameState(GameState.PAUSED);
  };

  const handleResume = () => {
    setIsPaused(false);
    setGameState(GameState.PLAYING);
  };

  const handleRestart = () => {
    setIsPaused(false);
    resetSession();
    setGameState(GameState.PLAYING);
  };

  const handleMainMenu = () => {
    setIsPaused(false);
    resetSession();
    router.replace('/');
  };

  return (
    <ScreenContainer contentStyle={styles.noPadding}>
      <View style={styles.container}>
        {/* Game HUD */}
        <GameHUD onPausePress={handlePause} />

        {/* Game Arena / Canvas Placeholder */}
        <View style={styles.canvasContainer}>
          <Card variant="neon" style={styles.canvasCard}>
            <View style={styles.coreOrbOuter}>
              <View style={styles.coreOrbInner}>
                <Ionicons name="flash" size={32} color={Colors.primary} />
              </View>
            </View>

            <Text style={styles.arenaTitle}>DRIFT ARENA SIMULATOR</Text>
            <Text style={styles.arenaSubtitle}>
              Mimarisi Hazır • Game Engine & Physics Step Bekleniyor
            </Text>

            <View style={styles.statusBadge}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
              <Text style={styles.statusText}>ENGINE INITIALIZED • 60 FPS READY</Text>
            </View>
          </Card>
        </View>

        {/* Placeholder Interactive Testing Bar */}
        <View style={styles.testControlsBar}>
          <Button
            title="+100 SKOR EKLE"
            onPress={() => incrementScore(100)}
            variant="outline"
            size="small"
            icon={<Ionicons name="add" size={16} color={Colors.primary} />}
            style={styles.testBtn}
          />

          <Button
            title="SIFIRLA"
            onPress={resetSession}
            variant="ghost"
            size="small"
            icon={<Ionicons name="refresh" size={16} color={Colors.textMuted} />}
            style={styles.testBtn}
          />
        </View>

        {/* In-Game Pause Modal Overlay */}
        <PauseModal
          visible={isPaused}
          onResume={handleResume}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
  },
  canvasContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  canvasCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: Colors.primaryGlow,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
  },
  coreOrbOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: Spacing.lg,
  },
  coreOrbInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryGlow,
  },
  arenaTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    letterSpacing: Typography.letterSpacing.wider,
    marginBottom: 4,
  },
  arenaSubtitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
    borderColor: Colors.success,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.success,
    letterSpacing: Typography.letterSpacing.wide,
  },
  testControlsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  testBtn: {
    flex: 1,
  },
});
