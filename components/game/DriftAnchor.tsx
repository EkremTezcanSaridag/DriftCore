import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
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
  const PYLON_SIZE = Math.max(48, radius * 2.8);

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
            opacity: isActive ? 0.5 : 0.2,
          },
        ]}
      />

      {/* Plasma Reactor Pylon Anchor Sprite */}
      <View
        style={[
          styles.pylonWrapper,
          {
            left: position.x - PYLON_SIZE / 2,
            top: position.y - PYLON_SIZE / 2,
            width: PYLON_SIZE,
            height: PYLON_SIZE,
          },
          isActive && styles.pylonWrapperActive,
        ]}
      >
        <Image
          source={require('../../assets/images/drift_anchor.png')}
          style={styles.pylonSprite}
          resizeMode="contain"
        />

        {/* Pulsing Active Core Glow Aura */}
        {isActive && (
          <View
            style={[
              styles.activeGlowAura,
              {
                backgroundColor: color,
                shadowColor: color,
              },
            ]}
          />
        )}
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
    borderWidth: 1.5,
  },
  pylonWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pylonWrapperActive: {
    transform: [{ scale: 1.15 }],
  },
  pylonSprite: {
    width: '100%',
    height: '100%',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  activeGlowAura: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    borderRadius: 9999,
    opacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
});
