import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Vector2D } from '../../types/game';
import { Colors } from '../../constants/colors';

interface CyberCarProps {
  position: Vector2D;
  angle: number; // In degrees (0 = UP)
  isHooked?: boolean;
  isNitroActive?: boolean;
  scale?: number;
}

export const CyberCar: React.FC<CyberCarProps> = ({
  position,
  angle = 0,
  isHooked = false,
  isNitroActive = false,
  scale = 1.0,
}) => {
  const CAR_WIDTH = 36 * scale;
  const CAR_LENGTH = 60 * scale;
  const safeAngle = Number.isFinite(angle) ? angle : 0;

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
          transform: [{ rotate: `${safeAngle}deg` }],
        },
      ]}
    >
      {/* High-Resolution 2D Cyberpunk Race Car Sprite (Pure Transparent) */}
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
  carSprite: {
    width: '100%',
    height: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  carSpriteDrifting: {
    shadowColor: Colors.secondary,
    shadowRadius: 18,
    shadowOpacity: 1,
  },
  nitroPlumeContainer: {
    position: 'absolute',
    bottom: -22,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 20,
    height: 24,
    zIndex: 90,
  },
  nitroOuterGlow: {
    width: 16,
    height: 22,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    opacity: 0.95,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
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
