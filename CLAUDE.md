# CLAUDE.md — Lodi Pasta (v1.0.0-build.001)

## Attention & Identity Guardrail
- The user is **Mr Ogi**. Always address him as Mr Ogi in all summaries, log headers, and completions.
- **Strict Full-File Replacement Rule**: NEVER provide partial snippets, diff chunks, or instructions like "insert lines 12–20". Always output the ENTIRE file ready for complete copy-paste replacement.
- **Terminal Command Rule**: Always present shell commands strictly ONE LINE per code block. Never chain commands with `&&` or put multiple lines in a single box.

---

## 1. Operating Discipline (Karpathy Engineering Guidelines)

### Think Before Coding
- State assumptions explicitly. If requirements are ambiguous or have multiple valid paths, pause and ask Mr Ogi before editing.
- Never hide confusion. If something in the calculations, state, or hydration curve is unclear, surface it first.
- Push back when warranted. If a simpler implementation exists, propose it.

### Simplicity First (YAGNI)
- Minimum code that solves the problem. No speculative abstractions, unrequested configurability, or future-proofing.
- Avoid introducing complex state libraries when local React state and `localStorage` are sufficient.
- If 200 lines can be written cleanly in 50 lines, write 50.

### Surgical Changes
- Touch only what is strictly necessary. Never refactor, reformat, or "tidy up" adjacent code or working modules.
- Maintain existing naming conventions and component hierarchy.

### Goal-Driven Execution
- Define clear verification criteria before executing changes.
- Verify that TypeScript compiles (`npm run build` or `npx tsc --noEmit`) with zero errors and zero `any` types before considering tasks complete.

---

## 2. Project Overview & Tech Stack
Lodi Pasta is a mobile-first kitchen companion web application and PWA tailored specifically for the Philips 7000 Series Pasta Maker.

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS (Dark Mode by default: zinc-900 / zinc-950 background with amber-400 accent)
- **Icons**: `lucide-react`
- **State & Storage**: React State + `localStorage` for custom profiles, disc presets, and saved batch records
- **Hardware Integration**: Screen Wake Lock API (`navigator.wakeLock`) to keep the screen alive during cooking

---

## 3. Philips 7000 Mathematical Engine & Rules

### Flour Discrete Snapping
- Auger pressure requires discrete batches. Total flour weight MUST snap to practical 50g increments (default steps: 200g, 250g, 300g, 350g, 400g, 450g, 500g, 600g).
- Arbitrary non-rounded inputs (e.g., 371g) must automatically snap to the nearest valid 50g step.

### Precision Liquid Engine (Egg + Water on the Gram)
- Default Egg Hydration Ratio: **38.0%** (Extrusion safety band: 36.0% – 40.0%).
- Formula: `Total Liquid (g) = Total Flour (g) * Hydration Ratio`.
  - 400g flour * 0.38 = 152g liquid.
  - 350g flour * 0.38 = 133g liquid.
- Kitchen Scale Flow:
  1. User tares measuring vessel on scale (0g).
  2. User cracks egg(s) into vessel (weighed in grams).
  3. App dynamically computes: `Water to Add = Total Liquid Target - Actual Egg Weight`.
  4. Output displays down to the single gram.

### Flour Ratio Blends
- **Caputo Semola Rimacinata (Yellow)**: Extrusion rigidity, structure, and al dente bite.
- **Caputo Cuoco Tipo 00 (Red)**: Smoothness, elasticity, and kid-friendly texture.
- Presets:
  - `Balanced (50/50)`: 50% Yellow / 50% Red
  - `Kids Soft`: 37.5% Yellow / 62.5% Red
  - `Traditional Al-Dente`: 70% Yellow / 30% Red
- Safety Banner: Trigger visual warning if Red flour > 70% (gummy extrusion risk) or Yellow flour is 100% without egg (brittle extrusion risk).

### Disc Waste Allowance ("פחת")
- Residual dough trapped in the front sleeve and shaping die averages **30g** (configurable: 20g–45g).
- Servings calculation:
  - Adult Portion: ~150g fresh pasta (yielded from ~100g dry flour).
  - Child Portion: ~90g fresh pasta (yielded from ~60g dry flour).
  - `Required Output = (Adults * 150g) + (Kids * 90g) + WasteAllowance(30g)`.
  - Maps up to the nearest safe 50g flour batch.

---

## 4. Culinary Protocols & Embedded Workflows
1. **Recycle Initial Output**: Prompt the user to cut the first 3–5 cm of extruded pasta and drop it back into the mixing chamber via top lid slots for uniform extrusion density.
2. **Liquid Pour Timing**: Pour mixed egg and water smoothly over 15–20 seconds across all lid slits while the auger rotates.
3. **Multi-Batch Maintenance**: Never let disc holes dry out between batches. If cooking lunch and dinner runs, submerge shaping disc and front sleeve in water.
4. **Flash-Freezing**: Flash freeze pasta nests on parchment for 45–60 minutes until rock solid before vacuum sealing (embossed bags, gentle mode). Cook directly from frozen.
5. **Tomato Paste Sautéing**: Always sauté tomato paste in fat for 2–3 minutes until it deepens from bright red to dark brick-orange before adding liquids.
6. **Emulsion Discipline**: Never add fine Parmesan over direct high heat; toss off heat with starchy pasta water.

---

## 5. Build Numbering & Release Tracking
- **Version Tracking**: Track builds in `package.json` and display in app footer.
- **Format**: `v[Major].[Minor].[Patch]-build.[Increment]` (Starting at `v1.0.0-build.001`).
- **Rule**: Whenever introducing a new feature, component, or calculation fix, increment the build counter by 1.

---

## 6. Directory Architecture
```text
lodi-pasta/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Calculator.tsx          # Main flour/liquid/egg engine with scale UI
│   │   ├── FlourRatioSlider.tsx    # Yellow vs. Red Caputo ratio control
│   │   ├── RecipeBook.tsx          # Categorized recipes with servings scaler
│   │   ├── RecipeCard.tsx          # Recipe detail view with culinary tips
│   │   ├── BestPracticesModal.tsx  # Extrusion guide, vacuum sealing, disc care
│   │   └── WakeLockToggle.tsx      # Screen wake lock toggle
│   ├── data/
│   │   └── recipes/
│   │       ├── index.ts            # Dynamic recipe catalog loader
│   │       ├── butter-parm.json    # Burro e Parmigiano with bouillon base
│   │       ├── tomato-base.json    # Sautéed tomato paste & rich sugo
│   │       ├── cream-garlic.json   # Panna e Aglio white sauce
│   │       ├── classic-aglio.json  # Aglio e Olio with parsley
│   │       └── basil-pesto.json    # Contrast vibrant pesto
│   ├── hooks/
│   │   ├── usePastaCalculator.ts   # Core reactive state machine
│   │   └── useWakeLock.ts          # Screen wake lock manager
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── math.ts                 # Snapping, scaling, and hydration formulas
│   ├── App.tsx                     # Main layout & navigation
│   ├── main.tsx
│   └── index.css
├── public/
├── CLAUDE.md
├── package.json
└── tailwind.config.js