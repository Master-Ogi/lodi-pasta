import type { BlendPreset, BoosterId, Boosters, FlourSplit, HydrationFeelKey, SafetyWarning, Servings, Unit } from '../types';

export const FLOUR_STEP_G = 50;
export const FLOUR_MIN_G = 200;
export const FLOUR_MAX_G = 600;
export const FLOUR_PRESETS_G = [200, 250, 300, 350, 400, 450, 500, 600];

/** Golden Spot — the locked default */
export const HYDRATION_DEFAULT = 0.38;
/** Fine-tune window (hard limits) */
export const HYDRATION_MIN = 0.365;
export const HYDRATION_MAX = 0.395;
export const HYDRATION_STEP = 0.005;

/** Dry flour per portion — already includes sleeve/disc residue */
export const ADULT_FLOUR_G = 120;
export const KID_FLOUR_G = 70;

export const RED_GUMMY_LIMIT_PCT = 70;

export const DEFAULT_YELLOW_PCT = 80;
export const BLEND_PRESETS: BlendPreset[] = [
  { id: 'artisanal-80', yellowPct: 80 },
  { id: 'gold-70', yellowPct: 70 },
  { id: 'balanced', yellowPct: 50 },
  { id: 'kids-soft', yellowPct: 35 },
];

/** Every flour in the split is weighed in clean 5g steps. */
export const FLOUR_SPLIT_STEP_G = 5;

/** Booster share of the total flour, taken out of the Red (Tipo 00). */
export const BOOSTER_PCT: Record<BoosterId, number> = { lentil: 15, tapioca: 8 };

/** Color/flavor doses are defined per this flour weight (middle of the 350–400g reference batch). */
export const COLOR_BASE_FLOUR_G = 375;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Snap arbitrary flour input (e.g. 371g) to the nearest valid 50g batch. */
export function snapFlour(grams: number): number {
  if (!Number.isFinite(grams)) return FLOUR_MIN_G;
  return clamp(Math.round(grams / FLOUR_STEP_G) * FLOUR_STEP_G, FLOUR_MIN_G, FLOUR_MAX_G);
}

/** Total Liquid (g) = Flour (g) × Hydration, rounded to the gram. */
export function liquidTarget(flourG: number, hydration: number): number {
  return Math.round(flourG * hydration);
}

/** Water to Add = Liquid Target − Actual Egg Weight. */
export function waterToAdd(liquidTargetG: number, eggG: number): number {
  return liquidTargetG - Math.round(eggG);
}

export function isGoldenSpot(hydration: number): boolean {
  return Math.abs(hydration - HYDRATION_DEFAULT) < 0.001;
}

/** 36.5–37.0 firm, 37.5–38.5 optimal, 39.0–39.5 soft. */
export function hydrationFeel(hydration: number): HydrationFeelKey {
  if (hydration < 0.3725) return 'firm';
  if (hydration > 0.3875) return 'soft';
  return 'optimal';
}

const roundToSplitStep = (grams: number): number => Math.round(grams / FLOUR_SPLIT_STEP_G) * FLOUR_SPLIT_STEP_G;

/**
 * Split the total into Yellow / Red / boosters, each rounded to 5g, summing to flourG exactly.
 * Boosters come out of the Red so the Semola keeps its gluten structure;
 * Yellow only gives way if the Red runs out (e.g. 80/20 with both boosters).
 */
export function splitFlour(flourG: number, yellowPct: number, boosters: Boosters): FlourSplit {
  const lentilG = boosters.lentil ? roundToSplitStep((flourG * BOOSTER_PCT.lentil) / 100) : 0;
  const tapiocaG = boosters.tapioca ? roundToSplitStep((flourG * BOOSTER_PCT.tapioca) / 100) : 0;
  const yellowTargetG = roundToSplitStep((flourG * yellowPct) / 100);
  const redG = Math.max(0, flourG - yellowTargetG - lentilG - tapiocaG);
  return { yellowG: flourG - lentilG - tapiocaG - redG, redG, lentilG, tapiocaG };
}

/**
 * Flour = Adults×120g + Kids×70g, rounded UP to the next 50g batch.
 * May exceed FLOUR_MAX_G — caller should prompt for multiple batches.
 */
export function flourForServings({ adults, kids }: Servings): number {
  const flourG = adults * ADULT_FLOUR_G + kids * KID_FLOUR_G;
  return Math.max(FLOUR_MIN_G, Math.ceil(flourG / FLOUR_STEP_G) * FLOUR_STEP_G);
}

export function safetyWarnings(yellowPct: number, eggG: number): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];
  if (100 - yellowPct > RED_GUMMY_LIMIT_PCT) warnings.push('red-gummy');
  if (yellowPct === 100 && eggG <= 0) warnings.push('yellow-brittle');
  return warnings;
}

/** Scale a color/flavor dose from the base batch to the current flour, to the nearest 0.5 (min 0.5). */
export function scaleColorDose(amount: number, flourG: number): number {
  return Math.max(0.5, Math.round(((amount * flourG) / COLOR_BASE_FLOUR_G) * 2) / 2);
}

/** Pasta flour a recipe's base quantities were written for (adult portions). */
export function recipeBaseFlour(baseServings: number): number {
  return baseServings * ADULT_FLOUR_G;
}

/** Scale a recipe quantity: g/ml to the unit (to 5 above 100), countables/spoons to the half. */
export function scaleQty(qty: number, factor: number, unit?: Unit): number {
  const value = qty * factor;
  if (unit === 'g' || unit === 'ml') return value >= 100 ? Math.round(value / 5) * 5 : Math.max(1, Math.round(value));
  return Math.max(0.5, Math.round(value * 2) / 2);
}
