import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/colors';
import { Radius, Spacing } from '../constants/spacing';
import { useGameStore } from '../store/useGameStore';

export default function MainMenuScreen() {
  const router = useRouter();
  const highScore = useGameStore((state) => state.highScore);
  const coins = useGameStore((state) => state.coins);

  // Pulse animation for Start Button and Floating Car
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
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

    // Floating car hover animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1400,
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
          {/* Player High Score Trophy Badge */}
          <View style={styles.playerBadge}>
            <View style={styles.rankIconWrapper}>
              <Ionicons name="trophy" size={16} color={Colors.warning} />
            </View>
            <View>
              <Text style={styles.rankLabel}>BEST SCORE</Text>
              <Text style={styles.rankValue}>{highScore}</Text>
            </View>
          </View>

          {/* Cyber Coin Balance Pill */}
          <View style={styles.currencyPill}>
            <Ionicons name="flash" size={15} color={Colors.warning} />
            <Text style={styles.currencyText}>{coins}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleNav('/shop')}
              style={styles.plusBtn}
            >
              <Ionicons name="add" size={12} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. GAME LOGO HEADER */}
        <View style={styles.logoContainer}>
          <Text style={styles.gameTitle}>
            DRIFT<Text style={styles.gameTitleAccent}>CORE</Text>
          </Text>
          <View style={styles.cyberSubBadge}>
            <Text style={styles.cyberSubText}>⚡ CYBER SLING RACER ⚡</Text>
          </View>
        </View>

        {/* 3. HERO 3D HYPERCAR SHOWCASE STAGE */}
        <View style={styles.stageContainer}>
          <Animated.View
            style={[
              styles.heroCarCard,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            {/* High-Resolution 3D Frontal Hypercar Render */}
            <Image
              source={require('../assets/images/hero_car_3d.png')}
              style={styles.heroCarImage}
              resizeMode="cover"
            />

            {/* Glowing Neon Cyber Border Accent */}
            <View style={styles.heroCardBorder} />

            {/* Car Name & Class Tag */}
            <View style={styles.carNameTag}>
              <Text style={styles.carNameText}>AETHER // PROTO-07</Text>
              <View style={styles.classBadge}>
                <Text style={styles.classBadgeText}>HYPER CLASS</Text>
              </View>
            </View>
          </Animated.View>

          {/* Performance Stats HUD Bar */}
          <View style={styles.specsRow}>
            <View style={styles.specBadge}>
              <Text style={styles.specLabel}>MAX SPEED</Text>
              <Text style={styles.specValue}>340 KM/H</Text>
            </View>
            <View style={styles.specBadge}>
              <Text style={styles.specLabel}>DRIFT ANGLE</Text>
              <Text style={[styles.specValue, { color: Colors.secondary }]}>65° PRO</Text>
            </View>
            <View style={styles.specBadge}>
              <Text style={styles.specLabel}>NITRO</Text>
              <Text style={[styles.specValue, { color: Colors.warning }]}>3.2X</Text>
            </View>
          </View>
        </View>

        {/* 4. BOTTOM ACTION CONSOLE & BUTTONS */}
        <View style={styles.bottomConsole}>
          {/* Giant Glowing Start Race Button */}
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
    paddingTop: 52,
    paddingBottom: 28,
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
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderColor: 'rgba(0, 240, 255, 0.35)',
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
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderColor: 'rgba(255, 184, 0, 0.45)',
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
    marginTop: 2,
  },
  gameTitle: {
    fontSize: 46,
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
    marginVertical: 4,
  },
  heroCarCard: {
    width: '100%',
    height: 210,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0A0F1D',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 8,
  },
  heroCarImage: {
    width: '100%',
    height: '100%',
  },
  heroCardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: Colors.primaryGlow,
    borderRadius: Radius.xl,
  },
  carNameTag: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(7, 11, 20, 0.75)',
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  carNameText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  classBadge: {
    backgroundColor: 'rgba(255, 0, 127, 0.3)',
    borderColor: Colors.secondary,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  classBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 0.5,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  specBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderColor: 'rgba(0, 240, 255, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.md,
    minWidth: 80,
  },
  specLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  specValue: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.primary,
    marginTop: 1,
  },
  bottomConsole: {
    gap: 16,
    alignItems: 'center',
  },
  giantPlayButton: {
    height: 58,
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
