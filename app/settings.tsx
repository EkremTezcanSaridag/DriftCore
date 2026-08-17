import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';
import { useSettingsStore } from '../store/useSettingsStore';
import { saveService } from '../services/SaveService';
import { GraphicsQuality } from '../types/settings';
import { Config } from '../constants/config';

export default function SettingsScreen() {
  const {
    sound,
    hapticsEnabled,
    graphicsQuality,
    toggleMusic,
    toggleSfx,
    toggleHaptics,
    setGraphicsQuality,
    resetSettings,
  } = useSettingsStore();

  const handleClearSaveData = async () => {
    await saveService.clear();
    resetSettings();
    alert('Kayıtlı oyun verileri sıfırlandı.');
  };

  return (
    <ScreenContainer>
      <Header title="AYARLAR" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Audio Section */}
        <Text style={styles.sectionHeader}>SES VE EFEKTLER</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <Ionicons
                name={sound.musicEnabled ? 'musical-notes' : 'musical-notes-outline'}
                size={20}
                color={sound.musicEnabled ? Colors.primary : Colors.textMuted}
              />
              <View>
                <Text style={styles.settingTitle}>Müzik</Text>
                <Text style={styles.settingSub}>Arka plan synthwave müzikleri</Text>
              </View>
            </View>
            <Switch
              value={sound.musicEnabled}
              onValueChange={toggleMusic}
              trackColor={{ false: Colors.surfaceLight, true: Colors.primaryGlow }}
              thumbColor={sound.musicEnabled ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <Ionicons
                name={sound.sfxEnabled ? 'volume-high' : 'volume-mute'}
                size={20}
                color={sound.sfxEnabled ? Colors.secondary : Colors.textMuted}
              />
              <View>
                <Text style={styles.settingTitle}>Ses Efektleri (SFX)</Text>
                <Text style={styles.settingSub}>Drift, toplama ve çarpışma sesleri</Text>
              </View>
            </View>
            <Switch
              value={sound.sfxEnabled}
              onValueChange={toggleSfx}
              trackColor={{ false: Colors.surfaceLight, true: Colors.secondaryGlow }}
              thumbColor={sound.sfxEnabled ? Colors.secondary : Colors.textMuted}
            />
          </View>
        </Card>

        {/* Haptics & Controls */}
        <Text style={styles.sectionHeader}>KONTROL VE TİTREŞİM</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="phone-portrait" size={20} color={Colors.accent} />
              <View>
                <Text style={styles.settingTitle}>Dokunsal Geri Bildirim (Haptics)</Text>
                <Text style={styles.settingSub}>Buton tıklamalarında hafif titreşim</Text>
              </View>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: Colors.surfaceLight, true: Colors.accentGlow }}
              thumbColor={hapticsEnabled ? Colors.accent : Colors.textMuted}
            />
          </View>
        </Card>

        {/* Graphics Quality */}
        <Text style={styles.sectionHeader}>GRAFİK VE PERFORMANS</Text>
        <Card style={styles.card}>
          <View style={styles.graphicsRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="hardware-chip" size={20} color={Colors.warning} />
              <View>
                <Text style={styles.settingTitle}>Grafik Kalitesi</Text>
                <Text style={styles.settingSub}>Efekt ve parçacık detay düzeyi</Text>
              </View>
            </View>
          </View>

          <View style={styles.qualitySelector}>
            {(['LOW', 'MEDIUM', 'HIGH'] as GraphicsQuality[]).map((q) => (
              <TouchableOpacity
                key={q}
                activeOpacity={0.7}
                onPress={() => setGraphicsQuality(q)}
                style={[
                  styles.qualityOption,
                  graphicsQuality === q && styles.qualityActiveOption,
                ]}
              >
                <Text
                  style={[
                    styles.qualityOptionText,
                    graphicsQuality === q && styles.qualityActiveOptionText,
                  ]}
                >
                  {q}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Data & App Info */}
        <Text style={styles.sectionHeader}>VERİ VE HAKKINDA</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="information-circle" size={20} color={Colors.textMuted} />
              <View>
                <Text style={styles.settingTitle}>Sürüm Bilgisi</Text>
                <Text style={styles.settingSub}>
                  {Config.appName} v{Config.version} (Build 100)
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Button
            title="KAYITLI VERİLERİ SIFIRLA"
            onPress={handleClearSaveData}
            variant="ghost"
            size="medium"
            icon={<Ionicons name="trash" size={18} color={Colors.secondary} />}
            textStyle={{ color: Colors.secondary }}
          />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  sectionHeader: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wider,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  card: {
    gap: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    paddingRight: Spacing.sm,
  },
  settingTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  settingSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  graphicsRow: {
    marginBottom: Spacing.sm,
  },
  qualitySelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  qualityOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qualityActiveOption: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderColor: Colors.warning,
  },
  qualityOptionText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
  },
  qualityActiveOptionText: {
    color: Colors.warning,
  },
});
