import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Vector2D } from '../../types/game';

interface CoreProps {
  position: Vector2D;
  radius?: number;
  trail?: Vector2D[];
}

export const Core: React.FC<CoreProps> = ({
  position,
  radius = 16,
  trail = [],
}) => {
  const size = radius * 2;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Motion Trail / Afterimage Effect */}
      {trail.map((point, index) => {
        const opacity = (index + 1) / (trail.length + 1) * 0.35;
        const scale = 0.6 + (index / (trail.length + 1)) * 0.4;
        const trailSize = size * scale;

        return (
          <View
            key={`trail-${index}`}
            style={[
              styles.trailDot,
              {
                width: trailSize,
                height: trailSize,
                borderRadius: trailSize / 2,
                left: point.x - trailSize / 2,
                top: point.y - trailSize / 2,
                opacity,
              },
            ]}
          />
        );
      })}

      {/* Outer Glow Halo */}
      <View
        style={[
          styles.outerHalo,
          {
            width: size + 16,
            height: size + 16,
            borderRadius: (size + 16) / 2,
            left: position.x - (size + 16) / 2,
            top: position.y - (size + 16) / 2,
          },
        ]}
      />

      {/* Core Player Body */}
      <View
        style={[
          styles.coreBody,
          {
            width: size,
            height: size,
            borderRadius: radius,
            left: position.x - radius,
            top: position.y - radius,
          },
        ]}
      >
        {/* Core Center Energy Nucleus */}
        <View style={styles.nucleus} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  trailDot: {
    position: 'absolute',
    backgroundColor: Colors.primary,
  },
  outerHalo: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.4)',
  },
  coreBody: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: Colors.text,
  },
  nucleus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
});
