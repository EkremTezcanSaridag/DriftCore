import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { CyberCar } from '../components/game/CyberCar';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';
import { useGameStore } from '../store/useGameStore';

export default function MainMenuScreen() {
  const router = useRouter();
  const highScore = useGameStore((state) => state.highScore);
  const coins = useGameStore((state) => state.coins);

  // Pulse animation for Start Button and Platform
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating car animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, floatAnim]);

  const handleStartRace = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
    router.push('/game');
  };

  const handleNav = (route: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    router.push(route as any);
  };

  return (
    <ImageBackground
      source={require('../assets/images/menu_bg.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {/* Dark Vignette Ambient Overlay */}
      <View style={styles.ambientOverlay}>
        {/* 1. TOP MOBILE GAME STATUS BAR */}
        <View style={styles.topGameBar}>
          {/* Player Level & High Score Badge */}
          <View style={styles.playerBadge}>
            <View style={styles.rankIconWrapper}>
              <Ionicons name="trophy" size={16} color={Colors.warning} />
            </View>
            <View>
              <Text style={styles.rankLabel}>BEST SCORE</Text>
              <Text style={styles.rankValue}>{highScore}</Text>
            </View>
          </View>

          {/* Currency Pill */}
          <View style={styles.currencyPill}>
            <Ionicons name="flash" size={15} color={Colors.warning} />
            <Text style={styles.currencyText}>{coins}</Text>
            <TouchableOpacity activeOpacity={0.7} style={styles.plusBtn}>
              <Ionicons name="add" size={12} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. GAME LOGO HEADER */}
        <View style={styles.logoContainer}>
          <Text style={styles.gameTitle}>DRIFT<Text style={styles.gameTitleAccent}>CORE</Text></Text>
          <View style={styles.cyberSubBadge}>
            <Text style={styles.cyberSubText}>⚡ CYBER SLING RACER ⚡</Text>
          </View>
        </View>

        {/* 3. HERO SHOWCASE CAR STAGE */}
        <View style={styles.stageContainer}>
          {/* Hologram Stage Rings */}
          <View style={styles.hologramStage}>
            <View style={styles.stageRingOuter} />
            <View style={styles.stageRingMid} />
            <View style={styles.stageRingCore} />

            {/* Glowing Ground Aura */}
            <View style={styles.groundGlow} />

            {/* Floating Animated Showcase CyberCar */}
            <Animated.View
              style={[
                styles.carWrapper,
                { transform: [{ translateY: floatAnim }, { scale: 1.5 }] },
              ]}
            >
              <CyberCar
                position={{ x: 0, y: 0 }}
                angle={0}
                isNitroActive={true}
              />
            </Animated.View>
          </View>

          {/* Car Tech Specs HUD */}
          <View style={styles.specsRow}>
            <View style={styles.specBadge}>
              <Text style={styles.specLabel}>SPD</Text>
              <Text style={styles.specValue}>320</Text>
            </View>
            <View style={styles.specBadge}>
              <Text style={styles.specLabel}>DRIFT</Text>
              <Text style={styles.specValue}>PRO</Text>
            </View>
            <View style={styles.specBadge}>
              <Text style={styles.specLabel}>NITRO</Text>
              <Text style={styles.specValue}>MAX</Text>
            </View>
          </View>
        </View>

        {/* 4. BOTTOM ACTION CONSOLE & FLOATING BUTTONS */}
        <View style={styles.bottomConsole}>
          {/* Main Giant Glowing Start Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%' }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleStartRace}
              style={styles.giantPlayButton}
            >
              <View style={styles.playGlowBackdrop} />
              <Ionicons name="play" size={28} color="#050811" />
              <Text style={styles.giantPlayText}>YARIŞA BAŞLA</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Floating Mobile Arcade Action Buttons */}
          <View style={styles.actionGrid}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => handleNav('/levels')}
              style={styles.arcadeBtn}
            >
              <View style={styles.arcadeBtnIconCircle}>
                <Ionicons name="grid" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.arcadeBtnText}>BÖLÜMLER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => handleNav('/shop')}
              style={styles.arcadeBtn}
            >
              <View style={[styles.arcadeBtnIconCircle, styles.garageCircle]}>
                <Ionicons name="car-sport" size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.arcadeBtnText}>GARAJ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => handleNav('/settings')}
              style={styles.arcadeBtn}
            >
              <View style={styles.arcadeBtnIconCircle}>
                <Ionicons name="settings" size={20} color={Colors.textSecondary} />
              </View>
              <Text style={styles.arcadeBtnText}>AYARLAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  ambientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 17, 0.72)',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  topGameBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  rankIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 184, 0, 0.2)',
    borderColor: Colors.warning,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  rankValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderColor: 'rgba(255, 184, 0, 0.4)',
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 6,
  },
  currencyText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.warning,
  },
  plusBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  gameTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 4,
    textShadowColor: Colors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  gameTitleAccent: {
    color: Colors.primary,
  },
  cyberSubBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 2,
  },
  cyberSubText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
  },
  stageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  hologramStage: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stageRingOuter: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.35)',
    borderStyle: 'dashed',
  },
  stageRingMid: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 0, 127, 0.35)',
  },
  stageRingCore: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  groundGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary,
    opacity: 0.15,
  },
  carWrapper: {
    width: 48,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  specLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  specValue: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.primary,
  },
  bottomConsole: {
    gap: 16,
    alignItems: 'center',
  },
  giantPlayButton: {
    height: 60,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  playGlowBackdrop: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.xl,
    backgroundColor: '#FFF',
    opacity: 0.15,
  },
  giantPlayText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#050811',
    letterSpacing: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  arcadeBtn: {
    alignItems: 'center',
    gap: 6,
  },
  arcadeBtnIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  garageCircle: {
    borderColor: 'rgba(255, 0, 127, 0.4)',
    shadowColor: Colors.secondary,
  },
  arcadeBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
  },
});
