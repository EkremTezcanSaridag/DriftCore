import { create } from 'zustand';
import { IShopItem, ItemType, ItemRarity, CurrencyType } from '../types/shop';

interface ShopStoreState {
  items: IShopItem[];
  equippedSkinId: string;
  equipItem: (itemId: string) => void;
  unlockItem: (itemId: string) => void;
}

const INITIAL_SHOP_ITEMS: IShopItem[] = [
  {
    id: 'skin_default',
    name: 'Cyber Core Alpha',
    description: 'Standard issue neon energy core.',
    type: ItemType.SKIN,
    rarity: ItemRarity.COMMON,
    price: 0,
    currency: CurrencyType.COIN,
    unlocked: true,
    equipped: true,
    primaryColor: '#00F0FF',
    secondaryColor: '#FF007F',
  },
  {
    id: 'skin_plasma_purple',
    name: 'Plasma Violet',
    description: 'High-frequency electric core with violet glow.',
    type: ItemType.SKIN,
    rarity: ItemRarity.RARE,
    price: 500,
    currency: CurrencyType.COIN,
    unlocked: false,
    equipped: false,
    primaryColor: '#7000FF',
    secondaryColor: '#00F0FF',
  },
  {
    id: 'skin_solar_flare',
    name: 'Solar Flare',
    description: 'Radiant golden core powered by solar wind.',
    type: ItemType.SKIN,
    rarity: ItemRarity.EPIC,
    price: 1200,
    currency: CurrencyType.COIN,
    unlocked: false,
    equipped: false,
    primaryColor: '#FFB800',
    secondaryColor: '#FF007F',
  },
];

export const useShopStore = create<ShopStoreState>((set) => ({
  items: INITIAL_SHOP_ITEMS,
  equippedSkinId: 'skin_default',

  equipItem: (itemId) =>
    set((state) => ({
      equippedSkinId: itemId,
      items: state.items.map((item) => ({
        ...item,
        equipped: item.id === itemId,
      })),
    })),

  unlockItem: (itemId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, unlocked: true } : item
      ),
    })),
}));
