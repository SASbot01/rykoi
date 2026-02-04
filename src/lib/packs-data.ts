// Pack definitions with real images and prices

export interface PackData {
  id: string;
  name: string;
  nameEs: string;
  price: number;
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
    price: 8,
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
    price: 11,
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
    price: 6,
    image: '/packs/phantom-flames.png',
    description: 'Mega Charizard X artwork',
    set: 'XY Series',
    cardsPerPack: 10,
  },
  {
    id: 'black-flame',
    name: 'Obsidian Flames',
    nameEs: 'Fulgor Negro',
    price: 6,
    image: '/packs/black-flame.png',
    description: 'Dark power unleashed',
    set: 'Scarlet & Violet',
    cardsPerPack: 10,
  },
  {
    id: 'white-flame',
    name: 'White Flame',
    nameEs: 'Llama Blanca',
    price: 6,
    image: '/packs/white-flame.png',
    description: 'Pure fire energy',
    set: 'XY Series',
    cardsPerPack: 10,
  },
  {
    id: 'mega-gardevoir',
    name: 'Mega Evolution',
    nameEs: 'Megaevolución',
    price: 6,
    image: '/packs/mega-gardevoir.png',
    description: 'Mega Gardevoir artwork',
    set: 'XY Series',
    cardsPerPack: 10,
  },
];

export const getFeaturedPacks = () => PACKS.filter(p => p.featured);
export const getPackById = (id: string) => PACKS.find(p => p.id === id);
export const getPacksByPrice = (price: number) => PACKS.filter(p => p.price === price);
