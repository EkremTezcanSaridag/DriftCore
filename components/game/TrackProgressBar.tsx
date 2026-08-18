import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/spacing';

interface TrackProgressBarProps {
  progress: number; // 0.0 (Start) to 1.0 (Finish)
}

export const TrackProgressBar: React.FC<TrackProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentString = Math.round(clampedProgress * 100);

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Outer Glow Track Line */}
      <View style={styles.trackGroove}>
        {/* Filled Progress Height */}
        <View style={[styles.filledBar, { height: `${percentString}%` }]} />

        {/* Moving Car Tracker Dot */}
        <View
          style={[
            styles.trackerDot,
            {
              bottom: `${percentString}%`,
            },
          ]}
        />
      </View>

      {/* Progress Percentage */}
      <Text style={styles.percentText}>{percentString}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 18,
    top: 60,
    bottom: 80,
    width: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 150,
  },
  trackGroove: {
    flex: 1,
    width: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Radius.full,
    overflow: 'visible',
    position: 'relative',
    marginVertical: 6,
  },
  filledBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  trackerDot: {
    position: 'absolute',
    left: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  percentText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
});
