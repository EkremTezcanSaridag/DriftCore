export enum ItemType {
  SKIN = 'SKIN',
  TRAIL = 'TRAIL',
  BOOSTER = 'BOOSTER',
}

export enum ItemRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export enum CurrencyType {
  COIN = 'COIN',
  REAL_MONEY = 'REAL_MONEY',
}

export interface IShopItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  price: number;
  currency: CurrencyType;
  unlocked: boolean;
  equipped: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}
