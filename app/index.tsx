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
import { soundService } from '../services/SoundService';

export default function MainMenuScreen() {
  const router = useRouter();
  const highScore = useGameStore((state) => state.highScore);
  const coins = useGameStore((state) => state.coins);

  // Pulse animation for Start Button, Floating Car, and Logo Glow
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const logoGlowAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    soundService.initialize();

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

    // Logo glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlowAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(logoGlowAnim, {
          toValue: 0.85,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, floatAnim, logoGlowAnim]);

  const handleStartRace = () => {
    soundService.playUiStart();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
    router.push('/game');
  };

  const handleNav = (route: string) => {
    soundService.playUiClick();
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

        {/* 2. BLOCKBUSTER 3D NEON ARCADE LOGO EMBLEM */}
        <Animated.View
          style={[
            styles.logoWrapper,
            { transform: [{ scale: logoGlowAnim }] },
          ]}
        >
          {/* Top Cyber Circuit Strip */}
          <View style={styles.circuitLineContainer}>
            <View style={styles.circuitDot} />
            <View style={styles.circuitBar} />
            <Text style={styles.circuitText}>SYSTEM // ONLINE</Text>
            <View style={styles.circuitBar} />
            <View style={styles.circuitDot} />
          </View>

          {/* Aggressive Slanted Chrome Title */}
          <View style={styles.logoTitleBox}>
            <Text style={styles.logoBracket}>◢</Text>
            <View style={styles.logoMainTextContainer}>
              <Text style={styles.logoDriftText}>DRIFT</Text>
              <Text style={styles.logoDivider}>//</Text>
              <Text style={styles.logoCoreText}>CORE</Text>
            </View>
            <Text style={styles.logoBracket}>◣</Text>
          </View>

          {/* Glowing Neon Subtitle Banner */}
          <View style={styles.cyberSubBadge}>
            <View style={styles.subAccentLeft} />
            <Text style={styles.cyberSubText}>⚡ HYPER VELOCITY ARCADE ⚡</Text>
            <View style={styles.subAccentRight} />
          </View>
        </Animated.View>

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
              <Text style={[styles.specValue, { color: Colors.primary }]}>3.2X BURST</Text>
            </View>
          </View>
        </View>

        {/* 4. BOTTOM ACTION DECK */}
        <View style={styles.bottomDeck}>
          {/* Main Giant Start Button */}
          <Animated.View
            style={[
              styles.startBtnWrapper,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.startBtn}
              onPress={handleStartRace}
            >
              <View style={styles.startBtnContent}>
                <Ionicons name="play" size={26} color="#050B14" />
                <Text style={styles.startBtnText}>YARIŞA BAŞLA</Text>
                <Ionicons name="flash" size={20} color="#050B14" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Floating Circle Quick Menu Buttons */}
          <View style={styles.quickNavRow}>
            {/* Level Select */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.circleNavBtn}
              onPress={() => handleNav('/levels')}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="map" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.navBtnLabel}>SEKTÖRLER</Text>
            </TouchableOpacity>

            {/* Garage / Shop */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.circleNavBtn}
              onPress={() => handleNav('/shop')}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="car-sport" size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.navBtnLabel}>GARAJ</Text>
            </TouchableOpacity>

            {/* Leaderboards */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.circleNavBtn}
              onPress={() => handleNav('/leaderboard')}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="podium" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.navBtnLabel}>SKORLAR</Text>
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.circleNavBtn}
              onPress={() => handleNav('/settings')}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="settings" size={20} color={Colors.textSecondary} />
              </View>
              <Text style={styles.navBtnLabel}>AYARLAR</Text>
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
    backgroundColor: 'rgba(5, 7, 18, 0.72)',
    paddingHorizontal: Spacing.md,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 44,
    paddingBottom: Spacing.lg,
    justifyContent: 'space-between',
  },
  topGameBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.4)',
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 8,
  },
  rankIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
  },
  rankValue: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.warning,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.4)',
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 6,
    gap: 6,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
  },
  plusBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  circuitLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  circuitDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowRadius: 6,
    shadowOpacity: 1,
  },
  circuitBar: {
    width: 28,
    height: 1.5,
    backgroundColor: 'rgba(0, 240, 255, 0.4)',
  },
  circuitText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
  },
  logoTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBracket: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.secondary,
    textShadowColor: Colors.secondary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  logoMainTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  logoDriftText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    fontStyle: 'italic',
    letterSpacing: 3,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  logoDivider: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primary,
    fontStyle: 'italic',
  },
  logoCoreText: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.secondary,
    fontStyle: 'italic',
    letterSpacing: 3,
    textShadowColor: Colors.secondary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  cyberSubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.4)',
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 4,
    gap: 6,
  },
  subAccentLeft: {
    width: 8,
    height: 2,
    backgroundColor: Colors.primary,
  },
  subAccentRight: {
    width: 8,
    height: 2,
    backgroundColor: Colors.secondary,
  },
  cyberSubText: {
    fontSize: 10,
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
    width: '92%',
    height: 210,
    borderRadius: Radius.xl,
    backgroundColor: 'rgba(10, 16, 30, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.5)',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 8,
  },
  heroCarImage: {
    width: '100%',
    height: '100%',
  },
  heroCardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 127, 0.3)',
    borderRadius: Radius.xl,
  },
  carNameTag: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 10, 22, 0.75)',
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  carNameText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
  },
  classBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  classBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '92%',
    marginTop: 10,
    gap: 8,
  },
  specBadge: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Radius.md,
    paddingVertical: 6,
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 11.5,
    fontWeight: '900',
    color: Colors.primary,
  },
  bottomDeck: {
    gap: 14,
  },
  startBtnWrapper: {
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 20,
    elevation: 8,
  },
  startBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  startBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#050B14',
    letterSpacing: 2,
  },
  quickNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  circleNavBtn: {
    alignItems: 'center',
    gap: 5,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  navBtnLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
});
