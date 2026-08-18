import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
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

  const SHARD_SIZE = 26;

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
      {/* Outer Pulse Glow Halo */}
      <View
        style={[
          styles.glowHalo,
          {
            backgroundColor: color,
            shadowColor: color,
          },
        ]}
      />

      {/* High-Resolution Crystal Diamond Shard Sprite */}
      <Image
        source={require('../../assets/images/energy_shard.png')}
        style={styles.shardSprite}
        resizeMode="contain"
      />
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
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.35,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  shardSprite: {
    width: '100%',
    height: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
});
