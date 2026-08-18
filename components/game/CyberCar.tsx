import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Vector2D } from '../../types/game';
import { Colors } from '../../constants/colors';

interface CyberCarProps {
  position: Vector2D;
  angle: number; // In degrees (0 = UP)
  isHooked?: boolean;
  isNitroActive?: boolean;
}

export const CyberCar: React.FC<CyberCarProps> = ({
  position,
  angle,
  isHooked = false,
  isNitroActive = false,
}) => {
  const CAR_WIDTH = 32;
  const CAR_LENGTH = 54;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.carContainer,
        {
          left: position.x - CAR_WIDTH / 2,
          top: position.y - CAR_LENGTH / 2,
          width: CAR_WIDTH,
          height: CAR_LENGTH,
          transform: [{ rotate: `${angle}deg` }],
        },
      ]}
    >
      {/* Front Headlight Light Beam Cones */}
      <View style={styles.headlightLeft} />
      <View style={styles.headlightRight} />

      {/* High-Resolution 2D Cyberpunk Race Car Sprite */}
      <Image
        source={require('../../assets/images/cyber_car.png')}
        style={[styles.carSprite, isHooked && styles.carSpriteDrifting]}
        resizeMode="contain"
      />

      {/* Nitro Flame Plume Jet */}
      {isNitroActive && (
        <View style={styles.nitroPlumeContainer}>
          <View style={styles.nitroOuterGlow} />
          <View style={styles.nitroInnerCore} />
        </View>
      )}

      {/* Drift Tire Spark Flares */}
      {isHooked && (
        <>
          <View style={styles.driftSparkLeft} />
          <View style={styles.driftSparkRight} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  headlightLeft: {
    position: 'absolute',
    top: -18,
    left: 2,
    width: 6,
    height: 18,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.75,
    borderRadius: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  headlightRight: {
    position: 'absolute',
    top: -18,
    right: 2,
    width: 6,
    height: 18,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.75,
    borderRadius: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  carSprite: {
    width: '100%',
    height: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  carSpriteDrifting: {
    shadowColor: Colors.secondary,
    shadowRadius: 14,
    shadowOpacity: 1,
  },
  nitroPlumeContainer: {
    position: 'absolute',
    bottom: -22,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 18,
    height: 24,
    zIndex: 90,
  },
  nitroOuterGlow: {
    width: 16,
    height: 22,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    opacity: 0.9,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  nitroInnerCore: {
    position: 'absolute',
    top: 0,
    width: 8,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    shadowColor: '#FFFFFF',
    shadowRadius: 8,
    shadowOpacity: 1,
  },
  driftSparkLeft: {
    position: 'absolute',
    bottom: 2,
    left: -6,
    width: 6,
    height: 6,
    backgroundColor: Colors.warning,
    borderRadius: 3,
    shadowColor: Colors.warning,
    shadowRadius: 8,
    shadowOpacity: 1,
  },
  driftSparkRight: {
    position: 'absolute',
    bottom: 2,
    right: -6,
    width: 6,
    height: 6,
    backgroundColor: Colors.warning,
    borderRadius: 3,
    shadowColor: Colors.warning,
    shadowRadius: 8,
    shadowOpacity: 1,
  },
});
