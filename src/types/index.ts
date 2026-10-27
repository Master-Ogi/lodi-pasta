/** Yellow = Caputo Semola Rimacinata, Red = Caputo Cuoco Tipo 00 */
export interface BlendPreset {
  id: 'balanced' | 'kids-soft' | 'al-dente';
  label: string;
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
  /** Residual dough trapped in sleeve + die (פחת), 20–45g */
  wasteG: number;
}

export type SafetyWarning = 'red-gummy' | 'yellow-brittle';

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

export interface HydrationFeel {
  label: string;
  detail: string;
}

export interface ColorAddition {
  name: string;
  /** Amount per 100g of flour */
  per100: number;
  unit: 'g' | 'ml';
}

export interface ColorFlavor {
  id: 'sunset' | 'purple' | 'green' | 'black' | 'herbs' | 'curry';
  label: string;
  /** Tailwind background class for the swatch */
  swatch: string;
  additions: ColorAddition[];
  note: string;
}

export type RecipeCategory = 'kids' | 'italian' | 'asian' | 'gourmet';
export type Disc = 'fettuccine' | 'spaghetti' | 'penne' | 'lasagna';
export type Unit = 'g' | 'ml' | 'tbsp' | 'tsp' | 'pc' | 'clove';

export interface Ingredient {
  item: string;
  /** Omitted for "to taste" items */
  qty?: number;
  unit?: Unit;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  categories: RecipeCategory[];
  disc: Disc;
  baseServings: number;
  minutes: number;
  ingredients: Ingredient[];
  steps: string[];
  tips: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
