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
