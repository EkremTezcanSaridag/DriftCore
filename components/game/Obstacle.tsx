import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BoundingBox } from '../../types/game';
import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/spacing';

interface ObstacleProps {
  bounds: BoundingBox;
  color?: string;
}

export const Obstacle: React.FC<ObstacleProps> = ({
  bounds,
  color = Colors.secondary,
}) => {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.obstacle,
        {
          left: bounds.x,
          top: bounds.y,
          width: bounds.width,
          height: bounds.height,
          borderColor: color,
          backgroundColor: color.startsWith('#')
            ? `${color}22`
            : 'rgba(255, 0, 128, 0.15)',
          shadowColor: color,
        },
      ]}
    >
      <View style={[styles.innerFrame, { borderColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  innerFrame: {
    width: '60%',
    height: '60%',
    borderWidth: 1,
    opacity: 0.4,
    borderRadius: Radius.sm,
  },
});
