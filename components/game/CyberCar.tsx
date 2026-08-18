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
  angle,
  isHooked = false,
  isNitroActive = false,
  scale = 1.0,
}) => {
  const CAR_WIDTH = 48 * scale;
  const CAR_LENGTH = 78 * scale;

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
    bottom: -28,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 24,
    height: 30,
    zIndex: 90,
  },
  nitroOuterGlow: {
    width: 20,
    height: 28,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    opacity: 0.95,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  nitroInnerCore: {
    position: 'absolute',
    top: 0,
    width: 10,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#FFFFFF',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  driftSparkLeft: {
    position: 'absolute',
    bottom: 4,
    left: -8,
    width: 8,
    height: 8,
    backgroundColor: Colors.warning,
    borderRadius: 4,
    shadowColor: Colors.warning,
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  driftSparkRight: {
    position: 'absolute',
    bottom: 4,
    right: -8,
    width: 8,
    height: 8,
    backgroundColor: Colors.warning,
    borderRadius: 4,
    shadowColor: Colors.warning,
    shadowRadius: 10,
    shadowOpacity: 1,
  },
});
