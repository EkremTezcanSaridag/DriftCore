import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Button } from '../ui/Button';

interface PauseModalProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  onResume,
  onRestart,
  onMainMenu,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>OYUN DURDURULDU</Text>
          <Text style={styles.subtitle}>DRIFTCORE SYNC STANDBY</Text>

          <View style={styles.buttonGroup}>
            <Button
              title="DEVAM ET"
              onPress={onResume}
              variant="primary"
              size="large"
              icon={<Ionicons name="play" size={18} color={Colors.background} />}
            />

            <Button
              title="YENİDEN BAŞLAT"
              onPress={onRestart}
              variant="outline"
              size="medium"
              icon={<Ionicons name="refresh" size={18} color={Colors.primary} />}
            />

            <Button
              title="ANA MENÜ"
              onPress={onMainMenu}
              variant="ghost"
              size="medium"
              icon={<Ionicons name="home" size={18} color={Colors.textSecondary} />}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryGlow,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    letterSpacing: Typography.letterSpacing.wider,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.xl,
  },
  buttonGroup: {
    width: '100%',
    gap: Spacing.md,
  },
});
