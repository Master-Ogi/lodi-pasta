import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { BouillonType, FlourAnalysis, FlourProfile, Wheat } from '../types';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage';

/** One default per role: Yellow = durum (structure), Red = soft wheat (softness). */
type Defaults = Record<Wheat, string | null>;

interface PantryState {
  flours: FlourProfile[];
  defaults: Defaults;
}

const preset = (id: string, name: string, grade: string, wheat: Wheat, inStock: boolean): FlourProfile => ({
  id,
  name,
  grade,
  wheat,
  proteinPct: null,
  strengthW: null,
  hydrationPct: null,
  pairing: null,
  inStock,
  custom: false,
});

const SEED: PantryState = {
  flours: [
    preset('caputo-semola', 'Caputo Semola Rimacinata', 'Semola di grano duro rimacinata', 'durum', true),
    preset('caputo-cuoco', 'Caputo Cuoco Tipo 00', 'Tipo 00', 'soft', true),
    preset('de-cecco-semola', 'De Cecco Semola Rimacinata', 'Semola di grano duro rimacinata', 'durum', false),
    preset('local-durum', 'Local durum semolina', 'Durum semolina', 'durum', false),
  ],
  defaults: { durum: 'caputo-semola', soft: 'caputo-cuoco' },
};

function loadPantry(): PantryState {
  const saved = loadJSON<Partial<PantryState>>(STORAGE_KEYS.pantry, {});
  if (!Array.isArray(saved.flours) || !saved.defaults) return SEED;
  return { flours: saved.flours, defaults: { ...SEED.defaults, ...saved.defaults } };
}

/** Fields from the "+ Add Flour" form */
export interface NewFlour {
  name: string;
  brand: string;
  wheat: Wheat;
  inStock: boolean;
}

/** Brand shown in front of the name when the user typed one */
export const flourLabel = (f: FlourProfile): string => (f.brand ? `${f.brand} ${f.name}` : f.name);

function loadBouillon(): BouillonType {
  return loadJSON<string>(STORAGE_KEYS.bouillon, '') === 'powder' ? 'powder' : 'paste';
}

interface PantryValue {
  flours: FlourProfile[];
  defaults: Defaults;
  defaultYellow: FlourProfile | undefined;
  defaultRed: FlourProfile | undefined;
  toggleStock: (id: string) => void;
  setDefault: (id: string) => void;
  remove: (id: string) => void;
  addFromAnalysis: (a: FlourAnalysis) => void;
  addCustom: (f: NewFlour) => void;
  bouillon: BouillonType;
  setBouillon: (type: BouillonType) => void;
}

const PantryContext = createContext<PantryValue | null>(null);

export function PantryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PantryState>(loadPantry);
  const [bouillon, setBouillon] = useState<BouillonType>(loadBouillon);

  useEffect(() => saveJSON(STORAGE_KEYS.pantry, state), [state]);
  useEffect(() => saveJSON(STORAGE_KEYS.bouillon, bouillon), [bouillon]);

  const find = (id: string | null) => state.flours.find((f) => f.id === id);

  const value: PantryValue = {
    flours: state.flours,
    defaults: state.defaults,
    defaultYellow: find(state.defaults.durum),
    defaultRed: find(state.defaults.soft),
    toggleStock: (id) =>
      setState((s) => ({ ...s, flours: s.flours.map((f) => (f.id === id ? { ...f, inStock: !f.inStock } : f)) })),
    setDefault: (id) =>
      setState((s) => {
        const flour = s.flours.find((f) => f.id === id);
        return flour ? { ...s, defaults: { ...s.defaults, [flour.wheat]: id } } : s;
      }),
    remove: (id) =>
      setState((s) => ({
        flours: s.flours.filter((f) => f.id !== id),
        defaults: {
          durum: s.defaults.durum === id ? null : s.defaults.durum,
          soft: s.defaults.soft === id ? null : s.defaults.soft,
        },
      })),
    addFromAnalysis: (a) =>
      setState((s) => ({
        ...s,
        flours: [
          ...s.flours,
          {
            id: `scan-${Date.now()}`,
            name: a.name,
            grade: a.grade,
            wheat: a.wheat,
            proteinPct: a.proteinPct,
            strengthW: a.strengthW,
            hydrationPct: a.hydrationPct,
            pairing: a.pairing,
            inStock: true,
            custom: true,
          },
        ],
      })),
    addCustom: ({ name, brand, wheat, inStock }) =>
      setState((s) => ({
        ...s,
        flours: [
          ...s.flours,
          {
            id: `custom-${Date.now()}`,
            name: name.trim(),
            brand: brand.trim() || undefined,
            grade: '',
            wheat,
            proteinPct: null,
            strengthW: null,
            hydrationPct: null,
            pairing: null,
            inStock,
            custom: true,
          },
        ],
      })),
    bouillon,
    setBouillon,
  };

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry(): PantryValue {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry must be used inside <PantryProvider>');
  return ctx;
}
