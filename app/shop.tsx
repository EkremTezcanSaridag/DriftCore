import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, Radius } from '../constants/spacing';
import { useShopStore } from '../store/useShopStore';
import { useGameStore } from '../store/useGameStore';

export default function ShopScreen() {
  const { items, equippedSkinId, equipItem, unlockItem } = useShopStore();
  const { coins, addCoins } = useGameStore();

  const handleItemPress = (itemId: string, unlocked: boolean, price: number) => {
    if (unlocked) {
      equipItem(itemId);
    } else if (coins >= price) {
      addCoins(-price);
      unlockItem(itemId);
      equipItem(itemId);
    }
  };

  return (
    <ScreenContainer>
      <Header
        title="MAĞAZA"
        rightElement={
          <View style={styles.coinHeader}>
            <Ionicons name="flash" size={16} color={Colors.primary} />
            <Text style={styles.coinText}>{coins}</Text>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>CORE KOZMETİKLERİ</Text>

        <View style={styles.gridContainer}>
          {items.map((item) => {
            const isEquipped = item.id === equippedSkinId;
            const canAfford = coins >= item.price;

            return (
              <Card
                key={item.id}
                variant={isEquipped ? 'neon' : 'surface'}
                style={styles.shopCard}
              >
                {/* Item Core Visual Preview */}
                <View
                  style={[
                    styles.itemPreviewOuter,
                    { borderColor: item.primaryColor || Colors.primary },
                  ]}
                >
                  <View
                    style={[
                      styles.itemPreviewInner,
                      { backgroundColor: item.secondaryColor || Colors.secondary },
                    ]}
                  />
                </View>

                {/* Info */}
                <View style={styles.itemInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Badge
                      label={item.rarity}
                      variant={
                        item.rarity === 'COMMON'
                          ? 'cyan'
                          : item.rarity === 'RARE'
                          ? 'violet'
                          : 'amber'
                      }
                    />
                  </View>

                  <Text style={styles.itemDesc}>{item.description}</Text>

                  {/* Actions */}
                  <View style={styles.actionSection}>
                    {isEquipped ? (
                      <View style={styles.equippedBadge}>
                        <Ionicons name="checkmark" size={14} color={Colors.primary} />
                        <Text style={styles.equippedText}>KUŞANILDI</Text>
                      </View>
                    ) : item.unlocked ? (
                      <Button
                        title="KUŞAN"
                        onPress={() => handleItemPress(item.id, true, 0)}
                        variant="outline"
                        size="small"
                      />
                    ) : (
                      <Button
                        title={`${item.price} COIN`}
                        onPress={() => handleItemPress(item.id, false, item.price)}
                        variant={canAfford ? 'primary' : 'ghost'}
                        size="small"
                        disabled={!canAfford}
                        icon={<Ionicons name="flash" size={14} color={canAfford ? Colors.background : Colors.textMuted} />}
                      />
                    )}
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        {/* Demo Coin Booster */}
        <Card variant="dark" style={styles.demoBanner}>
          <Ionicons name="sparkles" size={20} color={Colors.secondary} />
          <View style={styles.demoBannerText}>
            <Text style={styles.demoTitle}>TEST COIN EKLE</Text>
            <Text style={styles.demoSub}>Mağaza satın alım testleri için +500 coin ekler.</Text>
          </View>
          <Button
            title="+500"
            onPress={() => addCoins(500)}
            variant="secondary"
            size="small"
          />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  coinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  coinText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.wider,
    marginBottom: Spacing.xs,
  },
  gridContainer: {
    gap: Spacing.md,
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  itemPreviewOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
  },
  itemPreviewInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  itemDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  actionSection: {
    alignItems: 'flex-start',
  },
  equippedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primaryGlow,
  },
  equippedText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  demoBannerText: {
    flex: 1,
  },
  demoTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  demoSub: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
