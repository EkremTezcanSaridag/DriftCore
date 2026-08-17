import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';
import { useLevelStore } from '../store/useLevelStore';
import { useGameStore } from '../store/useGameStore';

export default function LevelsScreen() {
  const router = useRouter();
  const levels = useLevelStore((state) => state.levels);
  const setActiveLevelId = useGameStore((state) => state.setActiveLevelId);

  const handleSelectLevel = (levelId: string, unlocked: boolean) => {
    if (!unlocked) return;
    setActiveLevelId(levelId);
    router.push('/game');
  };

  return (
    <ScreenContainer>
      <Header title="BÖLÜMLER" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {levels.map((level) => {
          const isUnlocked = level.unlocked;

          return (
            <TouchableOpacity
              key={level.id}
              activeOpacity={isUnlocked ? 0.75 : 1}
              onPress={() => handleSelectLevel(level.id, isUnlocked)}
            >
              <Card
                variant={isUnlocked ? 'surface' : 'dark'}
                style={[styles.levelCard, !isUnlocked && styles.lockedCard]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.titleArea}>
                    <Text style={[styles.levelName, !isUnlocked && styles.lockedText]}>
                      {level.name}
                    </Text>
                    <Text style={styles.levelDesc}>{level.description}</Text>
                  </View>

                  <Badge
                    label={level.difficulty}
                    variant={
                      level.difficulty === 'EASY'
                        ? 'cyan'
                        : level.difficulty === 'MEDIUM'
                        ? 'magenta'
                        : 'amber'
                    }
                  />
                </View>

                <View style={styles.cardFooter}>
                  {/* Star Rating */}
                  <View style={styles.starRow}>
                    {[1, 2, 3].map((starIndex) => (
                      <Ionicons
                        key={starIndex}
                        name={starIndex <= level.starsEarned ? 'star' : 'star-outline'}
                        size={18}
                        color={starIndex <= level.starsEarned ? Colors.warning : Colors.borderLight}
                      />
                    ))}
                  </View>

                  {/* Requirements & Action */}
                  <View style={styles.actionRow}>
                    <Text style={styles.targetText}>
                      HEDEF: {level.requirements.targetScore} SKOR
                    </Text>

                    {isUnlocked ? (
                      <View style={styles.playBadge}>
                        <Ionicons name="play" size={14} color={Colors.primary} />
                        <Text style={styles.playText}>BAŞLAT</Text>
                      </View>
                    ) : (
                      <View style={styles.lockBadge}>
                        <Ionicons name="lock-closed" size={14} color={Colors.textMuted} />
                        <Text style={styles.lockText}>KİLİTLİ</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  levelCard: {
    padding: Spacing.lg,
  },
  lockedCard: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  titleArea: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  levelName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: 2,
  },
  lockedText: {
    color: Colors.textMuted,
  },
  levelDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  starRow: {
    flexDirection: 'row',
    gap: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
  },
  playBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: Typography.letterSpacing.wide,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
  },
});
