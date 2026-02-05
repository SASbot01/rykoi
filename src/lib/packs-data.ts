// Pack definitions with real images and prices (in coins/pokeballs)

export interface PackData {
  id: string;
  name: string;
  nameEs: string;
  price: number; // Price in coins (pokeballs)
  image: string;
  description: string;
  set: string;
  cardsPerPack: number;
  featured?: boolean;
}

export const PACKS: PackData[] = [
  {
    id: 'prismatic-evolutions',
    name: 'Prismatic Evolutions',
    nameEs: 'Evoluciones Prismáticas',
    price: 9, // Was 8, now +1
    image: '/packs/prismatic-evolutions.png',
    description: 'Espeon & Umbreon artwork',
    set: 'Scarlet & Violet',
    cardsPerPack: 10,
    featured: true,
  },
  {
    id: 'heroes-ascendentes',
    name: 'Rising Heroes',
    nameEs: 'Héroes Ascendentes',
    price: 12, // Was 11, now +1
    image: '/packs/heroes-ascendentes.png',
    description: 'Premium expansion pack',
    set: 'Scarlet & Violet',
    cardsPerPack: 10,
    featured: true,
  },
  {
    id: 'phantom-flames',
    name: 'Phantom Flames',
    nameEs: 'Fuegos Fantasmales',
    price: 7, // Was 6, now +1
    image: '/packs/phantom-flames.png',
    description: 'Mega Charizard X artwork',
    set: 'XY Series',
    cardsPerPack: 10,
  },
  {
    id: 'black-flame',
    name: 'Obsidian Flames',
    nameEs: 'Fulgor Negro',
    price: 7, // Was 6, now +1
    image: '/packs/black-flame.png',
    description: 'Dark power unleashed',
    set: 'Scarlet & Violet',
    cardsPerPack: 10,
  },
  {
    id: 'white-flame',
    name: 'White Flame',
    nameEs: 'Llama Blanca',
    price: 7, // Was 6, now +1
    image: '/packs/white-flame.png',
    description: 'Pure fire energy',
    set: 'XY Series',
    cardsPerPack: 10,
  },
  {
    id: 'mega-gardevoir',
    name: 'Mega Evolution',
    nameEs: 'Megaevolución',
    price: 7, // Was 6, now +1
    image: '/packs/mega-gardevoir.png',
    description: 'Mega Gardevoir artwork',
    set: 'XY Series',
    cardsPerPack: 10,
  },
];

// Coin system constants
export const COIN_SYSTEM = {
  // When user pays X euros, they get Y coins and Z goes to crowdfunding
  CONTRIBUTION_AMOUNT: 8, // User pays 8€
  COINS_RECEIVED: 6,      // User gets 6 coins
  CROWDFUND_AMOUNT: 2,    // 2€ goes to the box crowdfunding
};

export const getFeaturedPacks = () => PACKS.filter(p => p.featured);
export const getPackById = (id: string) => PACKS.find(p => p.id === id);
export const getPacksByPrice = (price: number) => PACKS.filter(p => p.price === price);
