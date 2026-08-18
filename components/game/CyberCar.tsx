import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Vector2D } from '../../types/game';
import { Colors } from '../../constants/colors';

interface CyberCarProps {
  position: Vector2D;
  angle: number; // In degrees (0 = UP)
  isHooked?: boolean;
}

export const CyberCar: React.FC<CyberCarProps> = ({
  position,
  angle,
  isHooked = false,
}) => {
  const CAR_WIDTH = 22;
  const CAR_LENGTH = 38;

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
      {/* Front Headlight Light Beams */}
      <View style={styles.headlightLeft} />
      <View style={styles.headlightRight} />

      {/* Main Aerodynamic Chassis */}
      <View style={[styles.chassis, isHooked && styles.chassisDrifting]}>
        {/* Front Wing Spoiler */}
        <View style={styles.frontWing} />

        {/* Cockpit Windshield */}
        <View style={styles.cockpit} />

        {/* Energy Core Intake Indicator */}
        <View style={styles.coreReactor} />

        {/* Rear Wing / Spoiler */}
        <View style={styles.rearWing} />

        {/* Dual Neon Jet Thruster Exhausts */}
        <View style={styles.thrusterContainer}>
          <View style={[styles.thruster, isHooked && styles.thrusterOverdrive]} />
          <View style={[styles.thruster, isHooked && styles.thrusterOverdrive]} />
        </View>
      </View>

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
    top: -12,
    left: 2,
    width: 4,
    height: 12,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.6,
    borderRadius: 2,
  },
  headlightRight: {
    position: 'absolute',
    top: -12,
    right: 2,
    width: 4,
    height: 12,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.6,
    borderRadius: 2,
  },
  chassis: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  chassisDrifting: {
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowRadius: 10,
  },
  frontWing: {
    width: 18,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  cockpit: {
    width: 12,
    height: 14,
    backgroundColor: '#1E293B',
    borderColor: Colors.primaryGlow,
    borderWidth: 1,
    borderRadius: 3,
  },
  coreReactor: {
    width: 6,
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    shadowColor: Colors.primary,
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  rearWing: {
    width: 20,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 2,
  },
  thrusterContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  thruster: {
    width: 4,
    height: 3,
    backgroundColor: Colors.secondary,
    borderRadius: 1,
    shadowColor: Colors.secondary,
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  thrusterOverdrive: {
    backgroundColor: Colors.warning,
    shadowColor: Colors.warning,
    shadowRadius: 8,
    height: 6,
  },
  driftSparkLeft: {
    position: 'absolute',
    bottom: 2,
    left: -4,
    width: 4,
    height: 4,
    backgroundColor: Colors.warning,
    borderRadius: 2,
    shadowColor: Colors.warning,
    shadowRadius: 6,
    shadowOpacity: 1,
  },
  driftSparkRight: {
    position: 'absolute',
    bottom: 2,
    right: -4,
    width: 4,
    height: 4,
    backgroundColor: Colors.warning,
    borderRadius: 2,
    shadowColor: Colors.warning,
    shadowRadius: 6,
    shadowOpacity: 1,
  },
});
