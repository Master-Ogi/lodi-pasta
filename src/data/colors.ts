import type { ColorFlavor } from '../types';

/** Doses per COLOR_BASE_FLOUR_G (375g) flour — scaled to the current batch. */
export const COLOR_FLAVORS: ColorFlavor[] = [
  {
    id: 'sunset',
    swatch: 'bg-orange-500',
    additions: [
      { id: 'beetroot', zone: 'dry', grams: 3, spoon: { qty: 1, unit: 'tsp' } },
      { id: 'turmeric', zone: 'dry', grams: 1.5, spoon: { qty: 0.5, unit: 'tsp' } },
    ],
  },
  {
    id: 'purple',
    swatch: 'bg-fuchsia-700',
    additions: [{ id: 'beetroot', zone: 'dry', grams: 3, spoon: { qty: 1, unit: 'tsp' } }],
  },
  {
    id: 'green',
    swatch: 'bg-green-600',
    additions: [{ id: 'spinachJuice', zone: 'liquid', replacesWater: true }],
  },
  {
    id: 'black',
    swatch: 'bg-zinc-950 ring-1 ring-zinc-600',
    additions: [{ id: 'squidInk', zone: 'liquid', spoon: { qty: 1, unit: 'tsp' } }],
  },
  {
    id: 'herbs',
    swatch: 'bg-emerald-500',
    additions: [{ id: 'herbs', zone: 'dry', spoon: { qty: 1, unit: 'tbsp' } }],
  },
  {
    id: 'curry',
    swatch: 'bg-yellow-500',
    additions: [{ id: 'curry', zone: 'dry', grams: 3.5 }],
  },
];
