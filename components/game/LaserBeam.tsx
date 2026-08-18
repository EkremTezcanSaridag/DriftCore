import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Vector2D } from '../../types/game';
import { Colors } from '../../constants/colors';

interface LaserBeamProps {
  from: Vector2D; // Car position
  to: Vector2D;   // Anchor position
  color?: string;
}

export const LaserBeam: React.FC<LaserBeamProps> = ({
  from,
  to,
  color = Colors.primary,
}) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.laserContainer,
        {
          left: midX - length / 2,
          top: midY - 1.5,
          width: length,
          height: 3,
          transform: [{ rotate: `${angleDeg}deg` }],
        },
      ]}
    >
      {/* Outer Glow Line */}
      <View
        style={[
          styles.glowLine,
          {
            backgroundColor: color,
            shadowColor: color,
          },
        ]}
      />

      {/* Inner Pure White Hot Energy Core */}
      <View style={styles.coreLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  laserContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  glowLine: {
    width: '100%',
    height: 3,
    borderRadius: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  coreLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 0.5,
  },
});
