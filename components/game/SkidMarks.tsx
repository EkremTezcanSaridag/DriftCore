import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export interface SkidSegment {
  id: string;
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  color: string;
  opacity: number;
}

interface SkidMarksProps {
  segments: SkidSegment[];
}

export const SkidMarks: React.FC<SkidMarksProps> = ({ segments }) => {
  return (
    <View pointerEvents="none" style={styles.container}>
      {segments.map((seg) => (
        <View
          key={seg.id}
          style={[
            styles.skidStrip,
            {
              left: seg.x - seg.width / 2,
              top: seg.y - seg.length / 2,
              width: seg.width,
              height: seg.length,
              opacity: seg.opacity,
              backgroundColor: seg.color,
              shadowColor: seg.color,
              transform: [{ rotate: `${seg.angle}deg` }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 25,
  },
  skidStrip: {
    position: 'absolute',
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 6,
    elevation: 2,
  },
});
