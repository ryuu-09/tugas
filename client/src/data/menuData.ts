import { MenuItem } from '@/types';

export const iceCreamMenu: MenuItem[] = [
  {
    id: 'ic-1',
    name: 'Vanilla Dream',
    description: 'Es krim vanilla lembut dengan taburan kacang almond.',
    price: 25000,
    category: 'ice-cream',
    image: '🍦',
  },
  {
    id: 'ic-2',
    name: 'Chocolate Heaven',
    description: 'Cokelat Belgia premium dengan saus cokelat melimpah.',
    price: 28000,
    category: 'ice-cream',
    image: '🍫',
  },
  {
    id: 'ic-3',
    name: 'Strawberry Cloud',
    description: 'Es krim stroberi segar dengan potongan buah asli.',
    price: 26000,
    category: 'ice-cream',
    image: '🍓',
  },
  {
    id: 'ic-4',
    name: 'Matcha Zen',
    description: 'Teh hijau Jepang autentik dengan rasa yang menenangkan.',
    price: 30000,
    category: 'ice-cream',
    image: '🍵',
  },
];

export const drinkMenu: MenuItem[] = [
  {
    id: 'dr-1',
    name: 'Mango Breeze',
    description: 'Jus mangga segar dengan topping jelly kelapa.',
    price: 22000,
    category: 'drink',
    image: '🥭',
  },
  {
    id: 'dr-2',
    name: 'Lychee Galaxy',
    description: 'Minuman leci soda dengan gradasi warna ungu cantik.',
    price: 24000,
    category: 'drink',
    image: '🌌',
  },
  {
    id: 'dr-3',
    name: 'Peach Sunset',
    description: 'Teh persik manis dengan potongan buah persik.',
    price: 23000,
    category: 'drink',
    image: '🍑',
  },
];

export const vipRoomDefaults = [
  { emoji: '🌸', capacity: { min: 2, max: 6 } },
  { emoji: '☁️', capacity: { min: 2, max: 4 } },
  { emoji: '✨', capacity: { min: 4, max: 8 } },
  { emoji: '🎀', capacity: { min: 2, max: 6 } },
];

export const toppings = [
  { id: 't-1', name: 'Almond', price: 5000 },
  { id: 't-2', name: 'Choco Chips', price: 4000 },
  { id: 't-3', name: 'Rainbow Sprinkles', price: 3000 },
  { id: 't-4', name: 'Caramel Sauce', price: 5000 },
  { id: 't-5', name: 'Oreo Crumbs', price: 4000 },
  { id: 't-6', name: 'Marshmallow', price: 5000 },
];
