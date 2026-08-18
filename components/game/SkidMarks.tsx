import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkidMark } from '../../types/physics';
import { Colors } from '../../constants/colors';

interface SkidMarksProps {
  marks: SkidMark[];
}

export const SkidMarks: React.FC<SkidMarksProps> = ({ marks }) => {
  return (
    <View pointerEvents="none" style={styles.container}>
      {marks.map((mark) => (
        <React.Fragment key={mark.id}>
          {/* Left Wheel Skid Mark */}
          <View
            style={[
              styles.skidDot,
              {
                left: mark.leftWheel.x - 2,
                top: mark.leftWheel.y - 2,
                opacity: mark.opacity,
              },
            ]}
          />
          {/* Right Wheel Skid Mark */}
          <View
            style={[
              styles.skidDot,
              {
                left: mark.rightWheel.x - 2,
                top: mark.rightWheel.y - 2,
                opacity: mark.opacity,
              },
            ]}
          />
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  skidDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
