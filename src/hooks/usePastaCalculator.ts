import { useMemo, useState } from 'react';
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

const INITIAL_STATE: CalculatorState = {
  flourG: 400,
  hydration: HYDRATION_DEFAULT,
  yellowPct: 50,
  eggG: 0,
  servings: { adults: 2, kids: 2, wasteG: WASTE_DEFAULT_G },
};

export function usePastaCalculator() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

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

  const setYellowPct = (pct: number) => setState((s) => ({ ...s, yellowPct: clamp(pct, 0, 100) }));

  const setEgg = (grams: number) =>
    setState((s) => ({ ...s, eggG: Number.isFinite(grams) ? Math.max(0, grams) : 0 }));

  const setServings = (patch: Partial<Servings>) =>
    setState((s) => {
      const next = { ...s.servings, ...patch };
      return {
        ...s,
        servings: {
          adults: Math.max(0, Math.round(next.adults)),
          kids: Math.max(0, Math.round(next.kids)),
          wasteG: clamp(Math.round(next.wasteG), WASTE_MIN_G, WASTE_MAX_G),
        },
      };
    });

  const applyServings = () => setFlour(result.servingsFlourG);

  return { state, result, setFlour, setHydration, setYellowPct, setEgg, setServings, applyServings };
}
