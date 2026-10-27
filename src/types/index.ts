export type Language = 'en' | 'he' | 'pl';

/** Yellow = durum semola (structure), Red = soft Tipo 00 (smoothness) */
export interface BlendPreset {
  id: 'semola-80' | 'balanced' | 'kids-soft';
  /** Percentage of Yellow flour (0–100). Red is the remainder. */
  yellowPct: number;
}

export interface FlourSplit {
  yellowG: number;
  redG: number;
}

export interface Servings {
  adults: number;
  kids: number;
}

export type SafetyWarning = 'red-gummy' | 'yellow-brittle';
export type HydrationFeelKey = 'firm' | 'optimal' | 'soft';

export interface CalculatorState {
  flourG: number;
  /** Hydration as a fraction, e.g. 0.38 */
  hydration: number;
  yellowPct: number;
  /** Actual weight of cracked eggs on the scale, in grams */
  eggG: number;
  servings: Servings;
}

export interface CalculatorResult {
  liquidTargetG: number;
  /** Negative when the eggs alone exceed the liquid target */
  waterToAddG: number;
  split: FlourSplit;
  warnings: SafetyWarning[];
  /** Flour batch recommended for the current servings */
  servingsFlourG: number;
}

export type Disc = 'spaghetti' | 'fettuccine' | 'penne' | 'lasagna' | 'angel-hair' | 'thick-round';

export type ColorId = 'sunset' | 'purple' | 'green' | 'black' | 'herbs' | 'curry';
export type AdditionId = 'beetroot' | 'turmeric' | 'spinachJuice' | 'squidInk' | 'herbs' | 'curry';

export interface ColorAddition {
  id: AdditionId;
  /** Dry chamber (mixed into flour) vs liquid cup (whisked with egg/water) */
  zone: 'dry' | 'liquid';
  /** Grams per COLOR_BASE_FLOUR_G of flour */
  grams?: number;
  /** Spoon measure per COLOR_BASE_FLOUR_G of flour */
  spoon?: { qty: number; unit: 'tsp' | 'tbsp' };
  /** Replaces the water portion of the liquid entirely */
  replacesWater?: boolean;
}

export interface ColorFlavor {
  id: ColorId;
  /** Tailwind background class for the swatch */
  swatch: string;
  additions: ColorAddition[];
}

export type Wheat = 'durum' | 'soft';

export interface FlourAnalysis {
  name: string;
  grade: string;
  wheat: Wheat;
  proteinPct: number | null;
  strengthW: number | null;
  /** Recommended hydration in percent, e.g. 38 */
  hydrationPct: number;
  pairing: string;
}

export interface FlourProfile {
  id: string;
  name: string;
  grade: string;
  wheat: Wheat;
  proteinPct: number | null;
  strengthW: number | null;
  hydrationPct: number | null;
  pairing: string | null;
  inStock: boolean;
  /** Added by the user (scan) — can be removed */
  custom: boolean;
}

export type RecipeCategory = 'kids' | 'italian' | 'asian' | 'gourmet';
export type Unit = 'g' | 'ml' | 'tbsp' | 'tsp' | 'pc' | 'clove';

export type RecipeId =
  | 'burro-parm'
  | 'tomato-sugo'
  | 'carbonara'
  | 'lasagna-bolognese'
  | 'classic-aglio'
  | 'basil-pesto'
  | 'cacio-pepe'
  | 'arrabbiata'
  | 'mac-cheese'
  | 'cream-garlic'
  | 'chicken-noodle-soup'
  | 'miso-ramen'
  | 'beef-udon'
  | 'jiaozi'
  | 'sesame-noodles'
  | 'salsiccia-fettuccine'
  | 'nero-pescatore'
  | 'mushroom-truffle';

/** Quantity only — the ingredient name lives in the i18n dictionary at the same index. Omit qty for "to taste". */
export interface IngredientAmount {
  qty?: number;
  unit?: Unit;
}

export interface Recipe {
  id: RecipeId;
  categories: RecipeCategory[];
  /** Recommended disc pairings, best first */
  discs: Disc[];
  baseServings: number;
  minutes: number;
  ingredients: IngredientAmount[];
}

export interface RecipeText {
  title: string;
  subtitle: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  /** Data URL of a photo the user sent */
  image?: string;
  /** Structured flour label analysis */
  flour?: FlourAnalysis;
}
