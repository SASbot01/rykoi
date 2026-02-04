import type { Rarity } from './database.types';

export interface PerkDefinition {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  value: Record<string, unknown>;
}

export interface NFTDefinition {
  tokenId: number;
  name: string;
  rarity: Rarity;
  perkId: string;
  imageUrl: string;
}

// Perk Definitions - 10 Unique Perks
export const GENESIS_PERKS: PerkDefinition[] = [
  {
    id: 'COIN_SURGE',
    name: 'Coin Surge',
    rarity: 'COMMON',
    description: '+5% coins extra en cada compra de packs',
    value: { bonus_percentage: 5 },
  },
  {
    id: 'SHADOW_CONTRIBUTOR',
    name: 'Shadow Contributor',
    rarity: 'COMMON',
    description: 'Tu nombre aparece oculto en contribuciones públicas',
    value: { anonymous_mode: true },
  },
  {
    id: 'EARLY_ACCESS',
    name: 'Early Access Protocol',
    rarity: 'RARE',
    description: '24h de acceso anticipado a nuevas cajas',
    value: { early_hours: 24 },
  },
  {
    id: 'MULTIPLIER_X1_2',
    name: 'Amplifier Node',
    rarity: 'RARE',
    description: 'x1.2 multiplicador en barras de progreso',
    value: { bar_multiplier: 1.2 },
  },
  {
    id: 'FREE_SHIPPING',
    name: 'Phantom Delivery',
    rarity: 'EPIC',
    description: 'Envío gratis de hits físicos (1 uso/mes)',
    value: { free_ships_monthly: 1 },
  },
  {
    id: 'RAFFLE_BOOST',
    name: 'Loaded Dice',
    rarity: 'EPIC',
    description: '+50% probabilidad en sorteos exclusivos',
    value: { raffle_boost: 50 },
  },
  {
    id: 'GENESIS_VAULT',
    name: 'Genesis Vault Key',
    rarity: 'LEGENDARY',
    description: 'Acceso a drops de cajas secretas (solo holders)',
    value: { vault_access: true },
  },
  {
    id: 'REFUND_SHIELD',
    name: 'Protocol Shield',
    rarity: 'LEGENDARY',
    description: 'Recupera 25% de contribuciones en cajas sin hit',
    value: { refund_percentage: 25 },
  },
  {
    id: 'ALPHA_SEAT',
    name: 'Alpha Seat',
    rarity: 'MYTHIC',
    description: 'Voto en qué cajas se abren + 10% profit share de hits',
    value: { governance: true, profit_share: 10 },
  },
  {
    id: 'INFINITE_PROTOCOL',
    name: 'Infinite Protocol',
    rarity: 'MYTHIC',
    description: '1 sobre gratis semanal + todos los perks EPIC activos',
    value: { weekly_pack: true, inherit_epic: true },
  },
];

// Rarity Distribution for 100 Genesis NFTs
export const RARITY_DISTRIBUTION: Record<Rarity, number> = {
  COMMON: 45,
  RARE: 30,
  EPIC: 15,
  LEGENDARY: 8,
  MYTHIC: 2,
};

// Drop rates for pack openings
export const DROP_RATES: Record<Rarity, number> = {
  COMMON: 55,
  RARE: 25,
  EPIC: 12,
  LEGENDARY: 6,
  MYTHIC: 2,
};

// Color coding for UI
export const RARITY_COLORS: Record<Rarity, string> = {
  COMMON: '#FFFFFF',
  RARE: '#00FFFF',
  EPIC: '#FF00FF',
  LEGENDARY: '#FF0000',
  MYTHIC: '#FFD700',
};

// Generate weighted random rarity based on drop rates
export function getRandomRarity(): Rarity {
  const rand = Math.random() * 100;
  let cumulative = 0;

  for (const [rarity, rate] of Object.entries(DROP_RATES) as [Rarity, number][]) {
    cumulative += rate;
    if (rand < cumulative) {
      return rarity;
    }
  }

  return 'COMMON';
}

// Get a random perk based on rarity
export function getRandomPerkByRarity(rarity: Rarity): PerkDefinition {
  const perksOfRarity = GENESIS_PERKS.filter((p) => p.rarity === rarity);

  if (perksOfRarity.length === 0) {
    // Fallback to any perk of similar or lower rarity
    const rarityOrder: Rarity[] = ['MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'COMMON'];
    const rarityIndex = rarityOrder.indexOf(rarity);

    for (let i = rarityIndex; i < rarityOrder.length; i++) {
      const fallbackPerks = GENESIS_PERKS.filter((p) => p.rarity === rarityOrder[i]);
      if (fallbackPerks.length > 0) {
        return fallbackPerks[Math.floor(Math.random() * fallbackPerks.length)];
      }
    }
  }

  return perksOfRarity[Math.floor(Math.random() * perksOfRarity.length)];
}

// Calculate user perks from owned NFTs
export function calculateUserPerks(nfts: NFTDefinition[]) {
  const activePerks: Record<string, unknown> = {};

  for (const nft of nfts) {
    const perk = GENESIS_PERKS.find((p) => p.id === nft.perkId);
    if (!perk) continue;

    // Merge perk values (stackable where applicable)
    for (const [key, value] of Object.entries(perk.value)) {
      if (typeof value === 'number' && typeof activePerks[key] === 'number') {
        activePerks[key] = (activePerks[key] as number) + value;
      } else if (typeof value === 'boolean') {
        activePerks[key] = true;
      } else {
        activePerks[key] = value;
      }
    }
  }

  return activePerks;
}

// Pack tier pricing
export const PACK_TIERS = [1, 2, 5, 10, 20, 50, 100] as const;
export type PackTier = (typeof PACK_TIERS)[number];

// Cards per pack
export const CARDS_PER_PACK = 3;

// User rank thresholds (based on total contributed)
export const RANK_THRESHOLDS = {
  INITIATE: 0,
  BREAKER: 50,
  SYNDICATE: 250,
  PROTOCOL: 1000,
} as const;

export function getUserRank(totalContributed: number) {
  if (totalContributed >= RANK_THRESHOLDS.PROTOCOL) return 'PROTOCOL';
  if (totalContributed >= RANK_THRESHOLDS.SYNDICATE) return 'SYNDICATE';
  if (totalContributed >= RANK_THRESHOLDS.BREAKER) return 'BREAKER';
  return 'INITIATE';
}
