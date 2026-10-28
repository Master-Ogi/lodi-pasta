import type {
  AdditionId,
  BlendPreset,
  BoosterId,
  BouillonType,
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
    tooLarge: (needed: number, max: number) => string;
    flour: string;
    flourAria: string;
    presets: Record<BlendPreset['id'], string>;
    semolaSolo: string;
    boosters: {
      title: string;
      hint: string;
      capped: string;
      names: Record<BoosterId, string>;
      badges: Record<BoosterId, string>;
    };
    yellowFallback: string;
    redFallback: string;
    ratioAria: string;
    warnings: Record<SafetyWarning, string>;
    disc: string;
    boil: string;
    boilRange: (min: number, max: number) => string;
    /** Extra cue next to a disc's boil time */
    boilNotes: Partial<Record<Disc, string>>;
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
    camera: string;
    scanning: string;
    needKey: string;
    add: string;
    added: string;
    recHydration: (pct: number) => string;
    pairing: string;
    addFlour: string;
    addTitle: string;
    nameLabel: string;
    brandLabel: string;
    roleLabel: string;
    roleYellow: string;
    roleRed: string;
    save: string;
    cancel: string;
    deleteConfirm: string;
    delete: string;
    bouillon: { title: string } & Record<BouillonType, string>;
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
    /** Kitchen-volume hint next to a metric amount */
    approx: (volume: string) => string;
    bouillonName: Record<BouillonType, string>;
    stockLine: (water: string, dose: string, base: string) => string;
    bouillonStep: Record<BouillonType, (water: string, dose: string) => string>;
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
