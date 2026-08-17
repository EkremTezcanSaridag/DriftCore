import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="game" />
      <Stack.Screen name="levels" />
      <Stack.Screen name="shop" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
