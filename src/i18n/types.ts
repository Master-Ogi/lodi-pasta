import type {
  AdditionId,
  BlendPreset,
  BoosterId,
  ColorId,
  Disc,
  HydrationFeelKey,
  RecipeCategory,
  RecipeId,
  RecipeText,
  SafetyWarning,
  Unit,
} from '../types';

export interface Dictionary {
  locale: string;
  dir: 'ltr' | 'rtl';
  /** Language name in English — used to instruct Gemini */
  languageName: string;
  num: (n: number) => string;
  /** Format grams, e.g. "152g" / "152 ג׳" */
  g: (n: number) => string;
  units: Record<Unit, (q: number) => string>;

  app: {
    tagline: string;
    tabs: { calculator: string; recipes: string; chef: string };
    wakeOn: string;
    wakeOff: string;
    language: string;
  };

  calc: {
    servings: string;
    adults: string;
    kids: string;
    fewer: (label: string) => string;
    more: (label: string) => string;
    servingsHint: string;
    useFlour: (g: number) => string;
    tooLarge: (needed: number, max: number) => string;
    flour: string;
    flourAria: string;
    presets: Record<BlendPreset['id'], string>;
    boosters: { title: string; hint: string; names: Record<BoosterId, string>; badges: Record<BoosterId, string> };
    yellowFallback: string;
    redFallback: string;
    ratioAria: string;
    warnings: Record<SafetyWarning, string>;
    disc: string;
    boil: string;
    boilRange: (min: number, max: number) => string;
    lasagnaNote: string;
    liquid: string;
    totalLiquid: string;
    golden: string;
    custom: (pct: number) => string;
    fineTune: string;
    firmEnd: string;
    softEnd: string;
    reset: string;
    hydrationAria: string;
    feel: Record<HydrationFeelKey, { label: string; detail: string }>;
    tareEgg: string;
    tareHint: string;
    eggAria: string;
    waterToAdd: string;
    eggsExceed: (g: number) => string;
  };

  discs: Record<Disc, string>;

  color: {
    title: string;
    forFlour: (g: number) => string;
    zone: { dry: string; liquid: string };
    items: Record<ColorId, string>;
    notes: Record<ColorId, string>;
    additions: Record<AdditionId, string>;
    replacesWater: string;
    absorbNote: string;
  };

  pantry: {
    title: string;
    yellowRole: string;
    redRole: string;
    inStock: string;
    setDefault: string;
    durum: string;
    soft: string;
    protein: (pct: number) => string;
    strength: (w: number) => string;
    remove: string;
    camera: string;
    scanning: string;
    needKey: string;
    add: string;
    added: string;
    recHydration: (pct: number) => string;
    pairing: string;
  };

  recipes: {
    categories: Record<RecipeCategory | 'all', string>;
    minutes: (m: number) => string;
    noMatch: string;
    back: string;
    flourBatch: (g: number) => string;
    ingredients: string;
    method: string;
    pairings: string;
    yourDisc: string;
    boilFor: (range: string) => string;
    notPaired: (disc: string) => string;
    toTaste: string;
    items: Record<RecipeId, RecipeText>;
  };

  chef: {
    connect: string;
    keyIntro: string;
    getKey: string;
    keyAria: string;
    saveKey: string;
    keySaved: string;
    removeKey: string;
    intro: string;
    suggestions: string[];
    thinking: string;
    placeholder: string;
    send: string;
    questionAria: string;
    photoSent: string;
    errors: { empty: string; invalid: string; http: (detail: string) => string; generic: string };
  };
}
