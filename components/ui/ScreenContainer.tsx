import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  hasNeonBorder?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  contentStyle,
  hasNeonBorder = false,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View
        style={[
          styles.content,
          hasNeonBorder && styles.neonBorder,
          contentStyle,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  neonBorder: {
    borderWidth: 1,
    borderColor: Colors.primaryGlow,
  },
});
