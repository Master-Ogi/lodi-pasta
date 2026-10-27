import { useEffect, useMemo, useState } from 'react';
import type { CalculatorResult, CalculatorState, Servings } from '../types';
import {
  HYDRATION_DEFAULT,
  HYDRATION_MAX,
  HYDRATION_MIN,
  WASTE_DEFAULT_G,
  WASTE_MAX_G,
  WASTE_MIN_G,
  clamp,
  flourForServings,
  liquidTarget,
  safetyWarnings,
  snapFlour,
  splitFlour,
  waterToAdd,
} from '../utils/math';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage';

/** Settings that survive a reload. Hydration always restarts at the Golden Spot; egg weight is per-batch. */
type PersistedSettings = Pick<CalculatorState, 'flourG' | 'yellowPct' | 'servings'>;

const DEFAULT_SERVINGS: Servings = { adults: 2, kids: 2, wasteG: WASTE_DEFAULT_G };

const sanitizeServings = (s: Servings): Servings => ({
  adults: Math.max(0, Math.round(s.adults)),
  kids: Math.max(0, Math.round(s.kids)),
  wasteG: clamp(Math.round(s.wasteG), WASTE_MIN_G, WASTE_MAX_G),
});

function loadInitialState(): CalculatorState {
  const saved = loadJSON<Partial<PersistedSettings>>(STORAGE_KEYS.calculator, {});
  return {
    flourG: snapFlour(Number(saved.flourG ?? 400)),
    hydration: HYDRATION_DEFAULT,
    yellowPct: clamp(Number(saved.yellowPct ?? 50), 0, 100),
    eggG: 0,
    servings: sanitizeServings({ ...DEFAULT_SERVINGS, ...saved.servings }),
  };
}

export function usePastaCalculator() {
  const [state, setState] = useState<CalculatorState>(loadInitialState);

  useEffect(() => {
    const settings: PersistedSettings = { flourG: state.flourG, yellowPct: state.yellowPct, servings: state.servings };
    saveJSON(STORAGE_KEYS.calculator, settings);
  }, [state.flourG, state.yellowPct, state.servings]);

  const result = useMemo<CalculatorResult>(() => {
    const liquidTargetG = liquidTarget(state.flourG, state.hydration);
    return {
      liquidTargetG,
      waterToAddG: waterToAdd(liquidTargetG, state.eggG),
      split: splitFlour(state.flourG, state.yellowPct),
      warnings: safetyWarnings(state.yellowPct, state.eggG),
      servingsFlourG: flourForServings(state.servings),
    };
  }, [state]);

  const setFlour = (grams: number) => setState((s) => ({ ...s, flourG: snapFlour(grams) }));

  const setHydration = (ratio: number) =>
    setState((s) => ({ ...s, hydration: clamp(ratio, HYDRATION_MIN, HYDRATION_MAX) }));

  const resetHydration = () => setState((s) => ({ ...s, hydration: HYDRATION_DEFAULT }));

  const setYellowPct = (pct: number) => setState((s) => ({ ...s, yellowPct: clamp(pct, 0, 100) }));

  const setEgg = (grams: number) =>
    setState((s) => ({ ...s, eggG: Number.isFinite(grams) ? Math.max(0, grams) : 0 }));

  const setServings = (patch: Partial<Servings>) =>
    setState((s) => ({ ...s, servings: sanitizeServings({ ...s.servings, ...patch }) }));

  const applyServings = () => setFlour(result.servingsFlourG);

  return {
    state,
    result,
    setFlour,
    setHydration,
    resetHydration,
    setYellowPct,
    setEgg,
    setServings,
    applyServings,
  };
}
