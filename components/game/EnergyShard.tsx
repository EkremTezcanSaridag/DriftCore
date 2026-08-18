import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Vector2D } from '../../types/game';
import { Colors } from '../../constants/colors';

interface EnergyShardProps {
  position: Vector2D;
  color?: string;
  collected?: boolean;
}

export const EnergyShard: React.FC<EnergyShardProps> = ({
  position,
  color = Colors.primary,
  collected = false,
}) => {
  if (collected) return null;

  const SHARD_SIZE = 18;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: position.x - SHARD_SIZE / 2,
          top: position.y - SHARD_SIZE / 2,
          width: SHARD_SIZE,
          height: SHARD_SIZE,
        },
      ]}
    >
      {/* Outer Glow Halo */}
      <View
        style={[
          styles.glowHalo,
          {
            backgroundColor: color,
            shadowColor: color,
          },
        ]}
      />

      {/* Diamond Crystal Body (Rotated 45 degrees) */}
      <View
        style={[
          styles.diamondBody,
          {
            borderColor: color,
            shadowColor: color,
          },
        ]}
      >
        {/* Inner Light Facet */}
        <View style={styles.facet} />

        {/* Pure White Core Star */}
        <View style={styles.coreStar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 45,
  },
  glowHalo: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.25,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  diamondBody: {
    width: 14,
    height: 14,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  facet: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: 5,
    height: 5,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
    borderRadius: 1,
  },
  coreStar: {
    width: 4,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});
