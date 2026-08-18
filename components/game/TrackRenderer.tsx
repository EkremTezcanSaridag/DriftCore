import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
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
  const DASH_INTERVAL = 100;
  const numDashes = Math.ceil(totalTrackLength / DASH_INTERVAL);
  const dashes = Array.from({ length: numDashes }, (_, i) => ({
    id: `dash-${i}`,
    y: totalTrackLength - i * DASH_INTERVAL,
  }));

  // Parallax background offset
  const bgOffsetY = (cameraY * 0.4) % viewportHeight;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {/* Dark Cyberpunk Asphalt Base */}
      <View style={styles.asphaltBg} />

      {/* Cyberpunk Neon Highway Image Backdrop (Parallax Scrolling) */}
      <View style={styles.highwayBackdropContainer}>
        <Image
          source={require('../../assets/images/menu_bg.png')}
          style={[
            styles.highwayBackdropImage,
            {
              transform: [{ translateY: -bgOffsetY }],
            },
          ]}
          resizeMode="cover"
        />
        {/* Dark Vignette Overlay for Crisp Track Legibility */}
        <View style={styles.highwayDarkOverlay} />
      </View>

      {/* Left Neon Guardrail Border with Light Glow */}
      <View style={[styles.guardrailLeft, { left: 4 }]} />
      <View style={[styles.guardrailGlow, { left: 5 }]} />

      {/* Right Neon Guardrail Border with Light Glow */}
      <View style={[styles.guardrailRight, { right: 4 }]} />
      <View style={[styles.guardrailGlow, { right: 5 }]} />

      {/* Repeating Glowing Center Road Dashes */}
      {dashes.map((dash) => {
        const screenY = dash.y - cameraY;
        if (screenY < -60 || screenY > viewportHeight + 60) return null;

        return (
          <View
            key={dash.id}
            style={[
              styles.centerDash,
              {
                left: viewportWidth / 2 - 3,
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
              left: 14,
              width: viewportWidth - 28,
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
              top: finishLineY - cameraY - 18,
              left: 14,
              width: viewportWidth - 28,
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
  highwayBackdropContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  highwayBackdropImage: {
    width: '100%',
    height: '180%',
    opacity: 0.4,
  },
  highwayDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 11, 20, 0.65)',
  },
  guardrailLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3.5,
    backgroundColor: Colors.primary,
    zIndex: 10,
  },
  guardrailRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3.5,
    backgroundColor: Colors.primary,
    zIndex: 10,
  },
  guardrailGlow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.45,
    zIndex: 9,
  },
  centerDash: {
    position: 'absolute',
    width: 6,
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    zIndex: 12,
  },
  startBanner: {
    position: 'absolute',
    height: 32,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    zIndex: 25,
  },
  startBannerText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: Typography.letterSpacing.wider,
  },
  finishGateBanner: {
    position: 'absolute',
    height: 40,
    borderWidth: 2,
    borderColor: Colors.success,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 102, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    zIndex: 35,
  },
  finishGateBannerText: {
    fontSize: 13,
    fontWeight: Typography.weights.black,
    color: Colors.success,
    letterSpacing: Typography.letterSpacing.arcade,
  },
});
