import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CyberCar } from '../components/game/CyberCar';
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
        {/* Top Bar / High Score & Coin Section */}
        <View style={styles.topSection}>
          <Card variant="neon" style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={18} color={Colors.warning} />
              <View>
                <Text style={styles.statLabel}>EN YÜKSEK SKOR</Text>
                <Text style={styles.statValue}>{highScore}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Ionicons name="flash" size={18} color={Colors.primary} />
              <View>
                <Text style={styles.statLabel}>CYBER COIN</Text>
                <Text style={styles.statValue}>{coins}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Hero Hologram Car Showcase */}
        <View style={styles.heroSection}>
          {/* Cyberpunk Arcade Badge */}
          <View style={styles.logoBadge}>
            <Ionicons name="hardware-chip" size={14} color={Colors.primary} />
            <Text style={styles.logoBadgeText}>CYBER SLING-DRIFT v2.0</Text>
          </View>

          {/* Holographic Car Platform */}
          <View style={styles.carPlatform}>
            {/* Pulsing Floor Grid Rings */}
            <View style={styles.platformRingOuter} />
            <View style={styles.platformRingInner} />

            {/* Showcase Neon Cyber Car */}
            <View style={styles.carWrapper}>
              <CyberCar
                position={{ x: 0, y: 0 }}
                angle={0}
                isNitroActive={true}
              />
            </View>
          </View>

          {/* Main Cyberpunk Title */}
          <Text style={styles.titleText}>DRIFTCORE</Text>
          <Text style={styles.subtitleText}>HYPER-VELOCITY NEON RACER</Text>
        </View>

        {/* Action Menu Buttons */}
        <View style={styles.menuSection}>
          <Button
            title="YARIŞA BAŞLA"
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
              title="GARAJ & SHOP"
              onPress={() => router.push('/shop')}
              variant="secondary"
              size="medium"
              icon={<Ionicons name="car-sport" size={18} color={Colors.text} />}
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
          <Text style={styles.footerText}>SLING-DRIFT ENGINE • 60 FPS ARCADE EXPERIENCE</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  topSection: {
    marginTop: Spacing.xs,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    backgroundColor: '#090D18',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
  },
  statValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.black,
    color: Colors.text,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    borderColor: Colors.primaryGlow,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  logoBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  carPlatform: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: Spacing.sm,
  },
  platformRingOuter: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    borderStyle: 'dashed',
  },
  platformRingInner: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 240, 255, 0.06)',
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  carWrapper: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1.3 }],
  },
  titleText: {
    fontSize: 42,
    fontWeight: Typography.weights.black,
    color: Colors.text,
    letterSpacing: Typography.letterSpacing.arcade,
    textAlign: 'center',
    textShadowColor: Colors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    marginTop: Spacing.xs,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginTop: 2,
  },
  menuSection: {
    gap: Spacing.sm,
  },
  playButton: {
    width: '100%',
  },
  secondaryGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  gridButton: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  footerText: {
    fontSize: 9,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDisabled,
    letterSpacing: Typography.letterSpacing.wider,
  },
});
