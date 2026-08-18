import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Vector2D } from '../../types/game';
import { Colors } from '../../constants/colors';

interface NeonCoinProps {
  position: Vector2D;
  collected?: boolean;
}

export const NeonCoin: React.FC<NeonCoinProps> = ({ position, collected = false }) => {
  if (collected) return null;

  const COIN_SIZE = 18;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: position.x - COIN_SIZE / 2,
          top: position.y - COIN_SIZE / 2,
          width: COIN_SIZE,
          height: COIN_SIZE,
        },
      ]}
    >
      {/* Outer Golden Aura Glow */}
      <View style={styles.goldAura} />

      {/* Cyber Gold Disc */}
      <View style={styles.coinDisc}>
        {/* Inner Circuit Detail */}
        <View style={styles.innerRing}>
          <Text style={styles.coinSymbol}>₵</Text>
        </View>
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
  goldAura: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.warning,
    opacity: 0.3,
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  coinDisc: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#78350F',
    borderColor: Colors.warning,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  innerRing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 184, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinSymbol: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
