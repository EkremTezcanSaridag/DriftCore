import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';
import { useGameStore } from '../store/useGameStore';

export default function MainMenuScreen() {
  const router = useRouter();
  const highScore = useGameStore((state) => state.highScore);
  const coins = useGameStore((state) => state.coins);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Top Bar / High Score Section */}
        <View style={styles.topSection}>
          <Card variant="neon" style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={20} color={Colors.warning} />
              <View>
                <Text style={styles.statLabel}>EN YÜKSEK SKOR</Text>
                <Text style={styles.statValue}>{highScore}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Ionicons name="flash" size={20} color={Colors.primary} />
              <View>
                <Text style={styles.statLabel}>COIN BALANSI</Text>
                <Text style={styles.statValue}>{coins}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Hero Title Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
            <Text style={styles.logoBadgeText}>ARCADE PROTOCOL v1.0</Text>
          </View>

          <Text style={styles.titleText}>DRIFTCORE</Text>
          <Text style={styles.subtitleText}>HYPER-VELOCITY CORE NAVIGATION</Text>
        </View>

        {/* Action Navigation Menu */}
        <View style={styles.menuSection}>
          <Button
            title="OYNA"
            onPress={() => router.push('/game')}
            variant="primary"
            size="large"
            icon={<Ionicons name="play" size={22} color={Colors.background} />}
            style={styles.playButton}
          />

          <View style={styles.secondaryGrid}>
            <Button
              title="BÖLÜMLER"
              onPress={() => router.push('/levels')}
              variant="outline"
              size="medium"
              icon={<Ionicons name="grid" size={18} color={Colors.primary} />}
              style={styles.gridButton}
            />

            <Button
              title="MAĞAZA"
              onPress={() => router.push('/shop')}
              variant="secondary"
              size="medium"
              icon={<Ionicons name="bag-handle" size={18} color={Colors.text} />}
              style={styles.gridButton}
            />
          </View>

          <Button
            title="AYARLAR"
            onPress={() => router.push('/settings')}
            variant="ghost"
            size="medium"
            icon={<Ionicons name="settings-sharp" size={18} color={Colors.textSecondary} />}
          />
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ANDROID FIRST • EXPONENTIAL CORE ENGINE</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  topSection: {
    marginTop: Spacing.xs,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
  statValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderColor: Colors.primaryGlow,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  logoBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  titleText: {
    fontSize: 44,
    fontWeight: Typography.weights.black,
    color: Colors.text,
    letterSpacing: Typography.letterSpacing.arcade,
    textAlign: 'center',
    textShadowColor: Colors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitleText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wider,
    marginTop: Spacing.xs,
  },
  menuSection: {
    gap: Spacing.md,
  },
  playButton: {
    width: '100%',
  },
  secondaryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  gridButton: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  footerText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDisabled,
    letterSpacing: Typography.letterSpacing.wider,
  },
});
