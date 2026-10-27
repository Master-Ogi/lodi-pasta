import type { ColorFlavor } from '../types';

/** Starting-point doses per 100g flour. Powders keep the liquid math exact. */
export const COLOR_FLAVORS: ColorFlavor[] = [
  {
    id: 'sunset',
    label: 'Sunset Orange',
    swatch: 'bg-orange-500',
    additions: [
      { name: 'Ground turmeric', per100: 0.75, unit: 'g' },
      { name: 'Beetroot powder', per100: 1, unit: 'g' },
    ],
    note: 'Whisk both powders into the dry flour before the mixing cycle starts.',
  },
  {
    id: 'purple',
    label: 'Purple (Beetroot)',
    swatch: 'bg-fuchsia-700',
    additions: [{ name: 'Beetroot powder', per100: 4, unit: 'g' }],
    note: 'Colour fades a little in boiling water — cook just to al dente.',
  },
  {
    id: 'green',
    label: 'Green (Spinach)',
    swatch: 'bg-green-600',
    additions: [{ name: 'Spinach powder', per100: 3, unit: 'g' }],
    note: 'Using fresh spinach purée instead? It is mostly water — subtract its weight from the water to add.',
  },
  {
    id: 'black',
    label: 'Black (Squid Ink)',
    swatch: 'bg-zinc-950 ring-1 ring-zinc-600',
    additions: [{ name: 'Squid / cuttlefish ink', per100: 2.5, unit: 'ml' }],
    note: 'Ink is liquid: add it to the vessel with the eggs before weighing, so it counts toward the liquid target.',
  },
  {
    id: 'herbs',
    label: 'Fresh Herbs',
    swatch: 'bg-emerald-500',
    additions: [{ name: 'Tarragon or rosemary, minced very fine', per100: 2, unit: 'g' }],
    note: 'Mince almost to a paste — leaf fragments can block small disc holes.',
  },
  {
    id: 'curry',
    label: 'Mild Curry',
    swatch: 'bg-yellow-500',
    additions: [{ name: 'Mild curry powder', per100: 1, unit: 'g' }],
    note: 'Pairs well with butter, chicken stock and Parmesan.',
  },
];
