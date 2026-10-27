import type { Disc, Recipe, RecipeCategory } from '../../types';
import { italianRecipes } from './italian';
import { kidsRecipes } from './kids';
import { asianRecipes } from './asian';
import { gourmetRecipes } from './gourmet';

export const RECIPES: Recipe[] = [...italianRecipes, ...kidsRecipes, ...asianRecipes, ...gourmetRecipes];

export const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  kids: 'Kids',
  italian: 'Italian Classics',
  asian: 'Asian & Dumplings',
  gourmet: 'Gourmet',
};

export const DISC_LABELS: Record<Disc, string> = {
  fettuccine: 'Fettuccine',
  spaghetti: 'Spaghetti',
  penne: 'Penne',
  lasagna: 'Lasagna sheet',
};
