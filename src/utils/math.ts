import type { BlendPreset, FlourSplit, HydrationFeel, SafetyWarning, Servings, Unit } from '../types';

export const FLOUR_STEP_G = 50;
export const FLOUR_MIN_G = 200;
export const FLOUR_MAX_G = 600;
export const FLOUR_PRESETS_G = [200, 250, 300, 350, 400, 450, 500, 600];

/** Golden Spot — the locked default */
export const HYDRATION_DEFAULT = 0.38;
/** Fine-tune window */
export const HYDRATION_MIN = 0.365;
export const HYDRATION_MAX = 0.395;
export const HYDRATION_STEP = 0.005;

export const WASTE_DEFAULT_G = 30;
export const WASTE_MIN_G = 20;
export const WASTE_MAX_G = 45;

export const ADULT_PORTION_G = 150;
export const KID_PORTION_G = 90;
/** 100g dry flour yields ~150g fresh pasta */
export const FRESH_PER_FLOUR = 1.5;

export const RED_GUMMY_LIMIT_PCT = 70;

export const BLEND_PRESETS: BlendPreset[] = [
  { id: 'balanced', label: 'Balanced (50/50)', yellowPct: 50 },
  { id: 'kids-soft', label: 'Kids Soft', yellowPct: 37.5 },
  { id: 'al-dente', label: 'Traditional Al-Dente', yellowPct: 70 },
];

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

/** Physical feedback for the current hydration: 36.5–37.0 firm, 37.5–38.5 optimal, 39.0–39.5 soft. */
export function hydrationFeel(hydration: number): HydrationFeel {
  if (hydration < 0.3725) {
    return { label: 'Firmer extrusion', detail: 'Drier crumbs, sharp edges, more auger strain. Good for penne and lasagna sheets.' };
  }
  if (hydration > 0.3875) {
    return { label: 'Soft / Kids texture', detail: 'Tender bite, slightly tacky strands — dust with semola so they don’t stick.' };
  }
  return { label: 'Optimal crumbly dough', detail: 'Pea-sized crumbs that press together when squeezed. Smooth, even extrusion.' };
}

export function splitFlour(flourG: number, yellowPct: number): FlourSplit {
  const yellowG = Math.round((flourG * yellowPct) / 100);
  return { yellowG, redG: flourG - yellowG };
}

/**
 * Required Output = Adults×150 + Kids×90 + Waste, converted to dry flour
 * and rounded UP to the next 50g batch. May exceed FLOUR_MAX_G — caller
 * should prompt for multiple batches in that case.
 */
export function flourForServings({ adults, kids, wasteG }: Servings): number {
  const requiredOutputG = adults * ADULT_PORTION_G + kids * KID_PORTION_G + wasteG;
  const flourG = requiredOutputG / FRESH_PER_FLOUR;
  return Math.max(FLOUR_MIN_G, Math.ceil(flourG / FLOUR_STEP_G) * FLOUR_STEP_G);
}

export function safetyWarnings(yellowPct: number, eggG: number): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];
  if (100 - yellowPct > RED_GUMMY_LIMIT_PCT) warnings.push('red-gummy');
  if (yellowPct === 100 && eggG <= 0) warnings.push('yellow-brittle');
  return warnings;
}

/** Color/flavor addition scaled to flour weight; 0.5 precision under 10, whole units above. */
export function additionForFlour(per100: number, flourG: number): number {
  const amount = (per100 * flourG) / 100;
  return amount < 10 ? Math.round(amount * 2) / 2 : Math.round(amount);
}

/** Scale a recipe quantity: g/ml to the unit (to 5 above 100), countables/spoons to the half. */
export function scaleQty(qty: number, factor: number, unit?: Unit): number {
  const value = qty * factor;
  if (unit === 'g' || unit === 'ml') return value >= 100 ? Math.round(value / 5) * 5 : Math.max(1, Math.round(value));
  return Math.max(0.5, Math.round(value * 2) / 2);
}
