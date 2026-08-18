import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface TrackRendererProps {
  cameraY: number;
  viewportWidth: number;
  viewportHeight: number;
  totalTrackLength: number;
  finishLineY: number;
}

export const TrackRenderer: React.FC<TrackRendererProps> = ({
  cameraY,
  viewportWidth,
  viewportHeight,
  totalTrackLength,
  finishLineY,
}) => {
  // Generate repeating dashed road center lines
  const DASH_INTERVAL = 90;
  const numDashes = Math.ceil(totalTrackLength / DASH_INTERVAL);
  const dashes = Array.from({ length: numDashes }, (_, i) => ({
    id: `dash-${i}`,
    y: totalTrackLength - i * DASH_INTERVAL,
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {/* Dark Cyberpunk Asphalt Background */}
      <View style={styles.asphaltBg} />

      {/* Left Neon Guardrail Border */}
      <View style={[styles.guardrailLeft, { left: 4 }]} />
      <View style={[styles.guardrailGlow, { left: 5 }]} />

      {/* Right Neon Guardrail Border */}
      <View style={[styles.guardrailRight, { right: 4 }]} />
      <View style={[styles.guardrailGlow, { right: 5 }]} />

      {/* Repeating Center Road Dashes */}
      {dashes.map((dash) => {
        const screenY = dash.y - cameraY;
        // Only render dashes visible within viewport (culling for 60 FPS)
        if (screenY < -50 || screenY > viewportHeight + 50) return null;

        return (
          <View
            key={dash.id}
            style={[
              styles.centerDash,
              {
                left: viewportWidth / 2 - 2,
                top: screenY,
              },
            ]}
          />
        );
      })}

      {/* Start Line Grid Banner */}
      {totalTrackLength - 100 - cameraY < viewportHeight + 100 && (
        <View
          style={[
            styles.startBanner,
            {
              top: totalTrackLength - 100 - cameraY,
              left: 12,
              width: viewportWidth - 24,
            },
          ]}
        >
          <Text style={styles.startBannerText}>▲ START GRID ▲</Text>
        </View>
      )}

      {/* Grand Finish Line Banner */}
      {finishLineY - cameraY > -80 && finishLineY - cameraY < viewportHeight + 80 && (
        <View
          style={[
            styles.finishGateBanner,
            {
              top: finishLineY - cameraY - 16,
              left: 12,
              width: viewportWidth - 24,
            },
          ]}
        >
          <Text style={styles.finishGateBannerText}>🏁 FINISH LINE 🏁</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  asphaltBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070B14',
  },
  guardrailLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.primary,
    zIndex: 10,
  },
  guardrailRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.primary,
    zIndex: 10,
  },
  guardrailGlow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.35,
    zIndex: 9,
  },
  centerDash: {
    position: 'absolute',
    width: 4,
    height: 38,
    backgroundColor: 'rgba(0, 240, 255, 0.4)',
    borderRadius: 2,
    zIndex: 12,
  },
  startBanner: {
    position: 'absolute',
    height: 28,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    zIndex: 25,
  },
  startBannerText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  finishGateBanner: {
    position: 'absolute',
    height: 36,
    borderWidth: 2,
    borderColor: Colors.success,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 102, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    zIndex: 35,
  },
  finishGateBannerText: {
    fontSize: 12,
    fontWeight: Typography.weights.black,
    color: Colors.success,
    letterSpacing: Typography.letterSpacing.arcade,
  },
});
