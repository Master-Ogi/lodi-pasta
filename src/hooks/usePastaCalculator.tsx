import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { BoosterId, CalculatorResult, CalculatorState, Servings } from '../types';
import {
  DEFAULT_YELLOW_PCT,
  HYDRATION_DEFAULT,
  HYDRATION_MAX,
  HYDRATION_MIN,
  clamp,
  flourForServings,
  liquidTarget,
  safetyWarnings,
  servingsFlourNeeded,
  snapFlour,
  splitFlour,
  waterToAdd,
} from '../utils/math';

const DEFAULT_SERVINGS: Servings = { adults: 2, kids: 2 };

const sanitizeServings = (s: Servings): Servings => ({
  adults: Math.max(0, Math.round(Number(s.adults) || 0)),
  kids: Math.max(0, Math.round(Number(s.kids) || 0)),
});

/** Every launch starts fresh: 2 adults + 2 kids (350g), Gold Spot 70/30, 38.0%, no boosters. */
const INITIAL_STATE: CalculatorState = {
  flourG: flourForServings(DEFAULT_SERVINGS),
  hydration: HYDRATION_DEFAULT,
  yellowPct: DEFAULT_YELLOW_PCT,
  eggG: 0,
  servings: DEFAULT_SERVINGS,
  boosters: { lentil: false, tapioca: false },
};

interface CalculatorValue {
  state: CalculatorState;
  result: CalculatorResult;
  setFlour: (grams: number) => void;
  setHydration: (ratio: number) => void;
  resetHydration: () => void;
  setYellowPct: (pct: number) => void;
  setEgg: (grams: number) => void;
  /** Servings drive the flour batch immediately */
  setServings: (patch: Partial<Servings>) => void;
  toggleBooster: (id: BoosterId) => void;
}

const CalculatorContext = createContext<CalculatorValue | null>(null);

/** Shared so the Calculator and recipe cards always show the same Adults & Kids and flour batch. */
export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  const result = useMemo<CalculatorResult>(() => {
    const liquidTargetG = liquidTarget(state.flourG, state.hydration);
    return {
      liquidTargetG,
      waterToAddG: waterToAdd(liquidTargetG, state.eggG),
      split: splitFlour(state.flourG, state.yellowPct, state.boosters),
      warnings: safetyWarnings(state.yellowPct, state.eggG),
      servingsNeededG: servingsFlourNeeded(state.servings),
    };
  }, [state]);

  const value: CalculatorValue = {
    state,
    result,
    setFlour: (grams) => setState((s) => ({ ...s, flourG: snapFlour(grams) })),
    // Hard limits 36.5–39.5% — anything outside is clamped.
    setHydration: (ratio) => setState((s) => ({ ...s, hydration: clamp(ratio, HYDRATION_MIN, HYDRATION_MAX) })),
    resetHydration: () => setState((s) => ({ ...s, hydration: HYDRATION_DEFAULT })),
    setYellowPct: (pct) => setState((s) => ({ ...s, yellowPct: clamp(pct, 0, 100) })),
    setEgg: (grams) => setState((s) => ({ ...s, eggG: Number.isFinite(grams) ? Math.max(0, grams) : 0 })),
    setServings: (patch) =>
      setState((s) => {
        const servings = sanitizeServings({ ...s.servings, ...patch });
        return { ...s, servings, flourG: flourForServings(servings) };
      }),
    toggleBooster: (id) => setState((s) => ({ ...s, boosters: { ...s.boosters, [id]: !s.boosters[id] } })),
  };

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

export function usePastaCalculator(): CalculatorValue {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error('usePastaCalculator must be used inside <CalculatorProvider>');
  return ctx;
}
