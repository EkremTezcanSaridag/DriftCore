import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Vector2D } from '../../types/game';
import { Colors } from '../../constants/colors';

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;    // 0.0 to 1.0
  maxLife: number;
}

interface DriftParticleSystemProps {
  particles: Particle[];
}

export const DriftParticleSystem: React.FC<DriftParticleSystemProps> = ({ particles }) => {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {particles.map((p) => (
        <View
          key={p.id}
          style={[
            styles.particle,
            {
              left: p.x - p.size / 2,
              top: p.y - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              opacity: p.life,
              shadowColor: p.color,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    zIndex: 80,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});
