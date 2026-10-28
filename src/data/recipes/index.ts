import type { Recipe } from '../../types';

// Quantities only. Ingredient names, steps and tips live in src/i18n/<lang>.ts at the same index.
// cupG = grams per US cup (grated cheese, packed leaves, chopped veg) for the kitchen-volume hint.
export const RECIPES: Recipe[] = [
  {
    id: 'burro-parm',
    categories: ['kids', 'italian'],
    discs: ['fettuccine', 'spaghetti'],
    baseServings: 4,
    minutes: 15,
    ingredients: [
      { qty: 60, unit: 'g', cupG: 227 }, // butter
      { qty: 80, unit: 'g', cupG: 80 }, // parmigiano
      { qty: 250, unit: 'ml', stock: true }, // bouillon
      {}, // black pepper
      {}, // salt
    ],
  },
  {
    id: 'tomato-sugo',
    categories: ['kids', 'italian'],
    discs: ['spaghetti', 'penne', 'angel-hair'],
    baseServings: 4,
    minutes: 35,
    ingredients: [
      { qty: 3, unit: 'tbsp' }, // olive oil
      { qty: 2, unit: 'clove' }, // garlic
      { qty: 2, unit: 'tbsp' }, // tomato paste
      { qty: 700, unit: 'ml' }, // passata
      { qty: 1, unit: 'tsp' }, // sugar
      { qty: 6, unit: 'pc' }, // basil leaves
      {}, // salt
    ],
  },
  {
    id: 'carbonara',
    categories: ['italian'],
    discs: ['spaghetti', 'thick-round'],
    baseServings: 4,
    minutes: 20,
    ingredients: [
      { qty: 150, unit: 'g' }, // guanciale
      { qty: 4, unit: 'pc' }, // egg yolks
      { qty: 1, unit: 'pc' }, // whole egg
      { qty: 60, unit: 'g', cupG: 80 }, // pecorino
      { qty: 20, unit: 'g', cupG: 80 }, // parmigiano
      { qty: 1, unit: 'tsp' }, // black pepper
    ],
  },
  {
    id: 'lasagna-bolognese',
    categories: ['italian'],
    discs: ['lasagna'],
    baseServings: 6,
    minutes: 180,
    ingredients: [
      { qty: 500, unit: 'g' }, // mince
      { qty: 1, unit: 'pc' }, // onion, carrot, celery
      { qty: 2, unit: 'tbsp' }, // tomato paste
      { qty: 120, unit: 'ml' }, // white wine
      { qty: 150, unit: 'ml' }, // milk (ragù)
      { qty: 400, unit: 'ml' }, // passata
      { qty: 50, unit: 'g', cupG: 227 }, // butter (béchamel)
      { qty: 50, unit: 'g', cupG: 125 }, // flour (béchamel)
      { qty: 600, unit: 'ml' }, // milk (béchamel)
      { qty: 100, unit: 'g', cupG: 80 }, // parmigiano
      {}, // nutmeg
    ],
  },
  {
    id: 'classic-aglio',
    categories: ['italian'],
    discs: ['spaghetti', 'angel-hair'],
    baseServings: 4,
    minutes: 15,
    ingredients: [
      { qty: 90, unit: 'ml' }, // olive oil
      { qty: 6, unit: 'clove' }, // garlic
      { qty: 0.5, unit: 'tsp' }, // chili flakes
      { qty: 3, unit: 'tbsp' }, // parsley
      {}, // salt
    ],
  },
  {
    id: 'basil-pesto',
    categories: ['italian', 'kids'],
    discs: ['fettuccine', 'spaghetti'],
    baseServings: 4,
    minutes: 15,
    ingredients: [
      { qty: 60, unit: 'g', cupG: 24 }, // basil
      { qty: 30, unit: 'g', cupG: 135 }, // pine nuts
      { qty: 1, unit: 'clove' }, // garlic
      { qty: 50, unit: 'g', cupG: 80 }, // parmigiano
      { qty: 20, unit: 'g', cupG: 80 }, // pecorino
      { qty: 120, unit: 'ml' }, // olive oil
    ],
  },
  {
    id: 'cacio-pepe',
    categories: ['italian'],
    discs: ['thick-round', 'spaghetti'],
    baseServings: 4,
    minutes: 15,
    ingredients: [
      { qty: 150, unit: 'g', cupG: 80 }, // pecorino
      { qty: 2, unit: 'tsp' }, // peppercorns
      {}, // salt
    ],
  },
  {
    id: 'arrabbiata',
    categories: ['italian'],
    discs: ['penne'],
    baseServings: 4,
    minutes: 25,
    ingredients: [
      { qty: 3, unit: 'tbsp' }, // olive oil
      { qty: 3, unit: 'clove' }, // garlic
      { qty: 1, unit: 'tsp' }, // chili flakes
      { qty: 1, unit: 'tbsp' }, // tomato paste
      { qty: 400, unit: 'g', cupG: 240 }, // crushed tomatoes
      { qty: 2, unit: 'tbsp' }, // parsley
    ],
  },
  {
    id: 'mac-cheese',
    categories: ['kids'],
    discs: ['penne'],
    baseServings: 4,
    minutes: 25,
    ingredients: [
      { qty: 40, unit: 'g', cupG: 227 }, // butter
      { qty: 30, unit: 'g', cupG: 125 }, // flour
      { qty: 500, unit: 'ml' }, // milk
      { qty: 200, unit: 'g', cupG: 113 }, // cheddar
      { qty: 40, unit: 'g', cupG: 80 }, // parmigiano
      { qty: 0.5, unit: 'tsp' }, // mustard powder
    ],
  },
  {
    id: 'cream-garlic',
    categories: ['kids'],
    discs: ['fettuccine', 'angel-hair'],
    baseServings: 4,
    minutes: 15,
    ingredients: [
      { qty: 30, unit: 'g', cupG: 227 }, // butter
      { qty: 3, unit: 'clove' }, // garlic
      { qty: 250, unit: 'ml' }, // cream
      { qty: 50, unit: 'g', cupG: 80 }, // parmigiano
      {}, // nutmeg
    ],
  },
  {
    id: 'chicken-noodle-soup',
    categories: ['kids'],
    discs: ['angel-hair', 'fettuccine'],
    baseServings: 4,
    minutes: 40,
    ingredients: [
      { qty: 400, unit: 'g' }, // chicken thighs
      { qty: 2, unit: 'pc' }, // carrots
      { qty: 2, unit: 'pc' }, // celery
      { qty: 1, unit: 'pc' }, // onion
      { qty: 1500, unit: 'ml', stock: true }, // stock
      { qty: 20, unit: 'g', cupG: 227 }, // butter
      { qty: 2, unit: 'tbsp' }, // parsley
    ],
  },
  {
    id: 'miso-ramen',
    categories: ['asian'],
    discs: ['spaghetti', 'angel-hair'],
    baseServings: 4,
    minutes: 30,
    ingredients: [
      { qty: 1400, unit: 'ml', stock: true }, // chicken stock
      { qty: 4, unit: 'tbsp' }, // white miso
      { qty: 2, unit: 'tbsp' }, // soy
      { qty: 1, unit: 'tbsp' }, // sesame oil
      { qty: 2, unit: 'clove' }, // garlic
      { qty: 10, unit: 'g', cupG: 96 }, // ginger
      { qty: 4, unit: 'pc' }, // eggs
      { qty: 150, unit: 'g', cupG: 150 }, // corn
      { qty: 3, unit: 'pc' }, // spring onions
      { qty: 2, unit: 'pc' }, // nori
    ],
  },
  {
    id: 'beef-udon',
    categories: ['asian'],
    discs: ['thick-round', 'fettuccine'],
    baseServings: 4,
    minutes: 25,
    ingredients: [
      { qty: 1200, unit: 'ml' }, // dashi
      { qty: 4, unit: 'tbsp' }, // soy
      { qty: 3, unit: 'tbsp' }, // mirin
      { qty: 1, unit: 'tbsp' }, // sugar
      { qty: 300, unit: 'g' }, // beef
      { qty: 1, unit: 'pc' }, // onion
      { qty: 3, unit: 'pc' }, // spring onions
      {}, // shichimi
    ],
  },
  {
    id: 'jiaozi',
    categories: ['asian'],
    discs: ['lasagna'],
    baseServings: 4,
    minutes: 60,
    ingredients: [
      { qty: 400, unit: 'g' }, // pork
      { qty: 300, unit: 'g', cupG: 75 }, // napa cabbage
      { qty: 1, unit: 'tsp' }, // salt
      { qty: 15, unit: 'g', cupG: 96 }, // ginger
      { qty: 3, unit: 'pc' }, // spring onions
      { qty: 2, unit: 'tbsp' }, // soy
      { qty: 1, unit: 'tbsp' }, // shaoxing
      { qty: 1, unit: 'tbsp' }, // sesame oil
      { qty: 3, unit: 'tbsp' }, // black vinegar
      { qty: 1, unit: 'tbsp' }, // chili oil
    ],
  },
  {
    id: 'sesame-noodles',
    categories: ['asian', 'kids'],
    discs: ['spaghetti', 'thick-round'],
    baseServings: 4,
    minutes: 15,
    ingredients: [
      { qty: 3, unit: 'tbsp' }, // tahini
      { qty: 1, unit: 'tbsp' }, // peanut butter
      { qty: 3, unit: 'tbsp' }, // soy
      { qty: 1, unit: 'tbsp' }, // vinegar
      { qty: 1, unit: 'tsp' }, // sugar
      { qty: 1, unit: 'clove' }, // garlic
      { qty: 1, unit: 'pc' }, // cucumber
      {}, // chili oil
    ],
  },
  {
    id: 'salsiccia-fettuccine',
    categories: ['gourmet'],
    discs: ['fettuccine', 'penne'],
    baseServings: 4,
    minutes: 25,
    ingredients: [
      { qty: 400, unit: 'g' }, // sausage
      { qty: 1, unit: 'tbsp' }, // olive oil
      { qty: 1, unit: 'pc' }, // shallot
      { qty: 2, unit: 'clove' }, // garlic
      { qty: 0.5, unit: 'tsp' }, // fennel seeds
      { qty: 100, unit: 'ml' }, // white wine
      { qty: 200, unit: 'ml' }, // cream
      { qty: 50, unit: 'g', cupG: 80 }, // parmigiano
      {}, // lemon zest
    ],
  },
  {
    id: 'nero-pescatore',
    categories: ['gourmet'],
    discs: ['spaghetti'],
    baseServings: 4,
    minutes: 30,
    ingredients: [
      { qty: 600, unit: 'g' }, // seafood
      { qty: 4, unit: 'tbsp' }, // olive oil
      { qty: 3, unit: 'clove' }, // garlic
      { qty: 250, unit: 'g', cupG: 150 }, // cherry tomatoes
      { qty: 120, unit: 'ml' }, // white wine
      { qty: 0.5, unit: 'tsp' }, // chili flakes
      { qty: 2, unit: 'tbsp' }, // parsley
    ],
  },
  {
    id: 'mushroom-truffle',
    categories: ['gourmet'],
    discs: ['fettuccine'],
    baseServings: 4,
    minutes: 25,
    ingredients: [
      { qty: 400, unit: 'g', cupG: 70 }, // mushrooms
      { qty: 40, unit: 'g', cupG: 227 }, // butter
      { qty: 1, unit: 'pc' }, // shallot
      { qty: 2, unit: 'clove' }, // garlic
      { qty: 1, unit: 'tsp' }, // thyme
      { qty: 80, unit: 'ml' }, // marsala
      { qty: 150, unit: 'ml' }, // cream
      { qty: 50, unit: 'g', cupG: 80 }, // parmigiano
      { qty: 1, unit: 'tsp' }, // truffle oil
    ],
  },
];
