import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DriftAnchor as DriftAnchorType } from '../../types/physics';
import { Colors } from '../../constants/colors';

interface DriftAnchorProps {
  anchor: DriftAnchorType;
  isActive?: boolean;
}

export const DriftAnchor: React.FC<DriftAnchorProps> = ({
  anchor,
  isActive = false,
}) => {
  const { position, radius, activeRange, color = Colors.secondary } = anchor;

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Outer Hook Range Guide Circle */}
      <View
        style={[
          styles.rangeCircle,
          {
            left: position.x - activeRange,
            top: position.y - activeRange,
            width: activeRange * 2,
            height: activeRange * 2,
            borderColor: color,
            borderStyle: 'dashed',
            opacity: isActive ? 0.45 : 0.15,
          },
        ]}
      />

      {/* Center Pillar Post (Solid Collision Body) */}
      <View
        style={[
          styles.pillar,
          {
            left: position.x - radius,
            top: position.y - radius,
            width: radius * 2,
            height: radius * 2,
            borderColor: color,
            shadowColor: color,
          },
          isActive && styles.pillarActive,
        ]}
      >
        {/* Core Energy Nucleus */}
        <View style={[styles.nucleus, { backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
  },
  rangeCircle: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
  },
  pillar: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  pillarActive: {
    borderWidth: 3,
    shadowRadius: 14,
    shadowOpacity: 1,
    transform: [{ scale: 1.15 }],
  },
  nucleus: {
    width: '45%',
    height: '45%',
    borderRadius: 9999,
    opacity: 0.9,
  },
});
