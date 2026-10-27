# CLAUDE.md — Lodi Pasta (v1.2.0-build.005)

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
- Avoid introducing complex state libraries when local React state, React context and `localStorage` are sufficient.
- If 200 lines can be written cleanly in 50 lines, write 50.

### Surgical Changes
- Touch only what is strictly necessary. Never refactor, reformat, or "tidy up" adjacent code or working modules.
- Maintain existing naming conventions and component hierarchy.

### Goal-Driven Execution
- Define clear verification criteria before executing changes.
- Verify that TypeScript compiles (`npm run build` or `npx tsc --noEmit`) with zero errors and zero `any` types before considering tasks complete.

---

## 2. Project Overview & Tech Stack
Lodi Pasta is a mobile-first kitchen companion web application and installable PWA tailored specifically for the Philips 7000 Series Pasta Maker.

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS v4 (Dark Mode by default: zinc-900 / zinc-950 background with amber-400 accent). Use logical properties (`ms-`/`me-`/`ps-`/`text-start`) and `rtl:` variants so layouts mirror in Hebrew.
- **Icons**: `lucide-react`
- **i18n**: English, Hebrew (RTL) and Polish dictionaries in `src/i18n/`. Every user-facing string lives there — never hard-code UI text in components. Hebrew is stored in logical order.
- **State & Storage**: React state + context (`I18nProvider`, `PantryProvider`) + `localStorage` (`lodi.*` keys) for language, disc, pantry, colors, calculator settings and the Gemini key.
- **AI**: Gemini REST API with the user's own key (BYOK) for the chef chat and flour-label photo analysis. The key is sent only to Google.
- **Hardware Integration**: Screen Wake Lock API (`navigator.wakeLock`) and the rear camera (`capture="environment"`).
- **PWA**: `public/sw.js` app-shell cache, registered in production only. Cache key = `lodi-pasta-v<version>`.

---

## 3. Philips 7000 Mathematical Engine & Rules

### Flour Discrete Snapping
- Auger pressure requires discrete batches. Total flour weight MUST snap to practical 50g increments between **200g and 600g** (presets: 200, 250, 300, 350, 400, 450, 500, 600g).
- Arbitrary non-rounded inputs (e.g., 371g) automatically snap to the nearest valid 50g step.

### Clean 5g Flour Split
- Every flour in the split (Yellow, Red, and any booster) is rounded to a clean **5g** increment — e.g. 130g + 220g = 350g, never 131g / 219g.
- The parts ALWAYS sum to the total flour exactly: Yellow is rounded to 5g, boosters are rounded to 5g, and Red takes the remainder.
- Displayed percentages are derived from the weighed grams (one decimal), so they always match the scale.

### Precision Liquid Engine (Egg + Water on the Gram)
- Default Egg Hydration Ratio: **38.0%** (the "Golden Spot"). Hard limits: **36.5% – 39.5%**, step 0.5%, with a one-tap reset to 38.0%. Hydration always restarts at 38.0% on load.
- Formula: `Total Liquid (g) = Total Flour (g) * Hydration Ratio` (boosters count as flour).
  - 400g flour * 0.38 = 152g liquid.
  - 350g flour * 0.38 = 133g liquid.
- Kitchen Scale Flow:
  1. User tares measuring vessel on scale (0g).
  2. User cracks egg(s) into vessel (weighed in grams).
  3. App dynamically computes: `Water to Add = Total Liquid Target - Actual Egg Weight`.
  4. Output displays down to the single gram.

### Flour Ratio Blends
- **Yellow — Semola Rimacinata (durum)**: Extrusion rigidity, structure, and al dente bite.
- **Red — Tipo 00 (soft wheat)**: Smoothness, elasticity, and kid-friendly texture.
- The default Yellow and Red flours are chosen in the Flour Pantry.
- Presets (Yellow / Red), active preset shown as an amber pill:
  1. `Artisanal 80/20` — default
  2. `Gold Spot 70/30`
  3. `Balanced 50/50`
  4. `Kids Soft 35/65`
- The ratio slider moves in 5% steps.
- Safety Banner: Trigger visual warning if Red flour > 70% (gummy extrusion risk) or Yellow flour is 100% without egg (brittle extrusion risk).

### Flour Boosters
- **Red Lentil Boost (קמח עדשים כתומות)**: 15% of total flour, rounded to 5g (400g batch → 60g). Badge: "High Protein · Natural Orange Hue".
- **Tapioca Elasticity (קמח טפיוקה)**: 8% of total flour, rounded to 5g (400g batch → 30g). Badge: "Elasticity & Gloss · Q-Texture".
- Boosters are deducted from the **Red (Tipo 00)** only; the Semola stays intact for gluten structure. Only if the Red runs out (e.g. 80/20 with both boosters) does the remainder come out of the Yellow, so the total stays exact.
- Toggling a booster off immediately restores the standard blend. Booster toggles persist.

### Servings Engine (shared by Calculator and Recipe Cards)
- Dual **Adults & Kids** counter (`ServingsCounter`) in both the Calculator and every recipe card.
- `Flour Batch = (Adults * 120g) + (Kids * 70g)`, rounded UP to the next 50g batch (minimum 200g). The 120g/70g portions already include sleeve/disc residue — there is no separate waste allowance.
- Above 600g the app asks for multiple batches.
- Recipe cards start from the Calculator's last saved Adults & Kids.
- Recipe sauce ingredients scale by `Flour Batch / (Recipe Base Servings * 120g)` — i.e. with the pasta actually made.

### Disc Boiling Times (fresh extruded pasta)
- Angel Hair 3–4 min · Spaghetti & Fettuccine 5–6 min · Penne & Thick Round 10–12 min · Lasagna 3–4 min (or par-boil 2 min before baking).
- The active Calculator disc leads the pairings in recipe cards.

### Color & Flavor Doses (per 375g flour, scaled to the nearest 0.5)
- Purple: 3g beet powder. Sunset: 3g beet + 1.5g turmeric. Curry: 3.5g. Herbs: 1 tbsp. (Dry Chamber)
- Black: 1 tsp squid ink. Green: spinach juice replaces the water. (Liquid Cup)

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
- **Version Tracking**: Track builds in `package.json` and display in app footer. Keep the service worker cache key in `public/sw.js` in step with the version.
- **Format**: `v[Major].[Minor].[Patch]-build.[Increment]` (Starting at `v1.0.0-build.001`; current `v1.2.0-build.005`).
- **Rule**: Whenever introducing a new feature, component, or calculation fix, increment the build counter by 1.

---

## 6. Directory Architecture
```text
lodi-pasta/
├── src/
│   ├── components/
│   │   ├── Calculator.tsx          # Servings, flour, boosters, pantry, colors, liquid/scale, disc & boil
│   │   ├── ServingsCounter.tsx     # Shared Adults & Kids counter (Calculator + RecipeCard)
│   │   ├── FlourRatioSlider.tsx    # Yellow vs. Red presets, slider and 5g split
│   │   ├── FlourBoosters.tsx       # Red Lentil / Tapioca toggles
│   │   ├── FlourPantryDrawer.tsx   # Flours in stock, defaults, camera scan
│   │   ├── ColorFlavorDrawer.tsx   # Color doses with Dry Chamber / Liquid Cup badges
│   │   ├── RecipeBook.tsx          # Category + disc filters
│   │   ├── RecipeCard.tsx          # Recipe detail, disc pairings, servings-scaled sauce
│   │   ├── ChefAssistant.tsx       # Gemini chef chat with photo analysis
│   │   ├── FlourAnalysisCard.tsx   # Flour label result + "Add to My Pantry"
│   │   ├── CameraButton.tsx        # Rear camera file input
│   │   ├── LanguageSelector.tsx    # EN | עב | PL
│   │   └── WakeLockToggle.tsx      # Screen wake lock toggle
│   ├── data/
│   │   ├── colors.ts               # Color/flavor additions and zones
│   │   ├── discs.ts                # Discs and boil times
│   │   └── recipes/index.ts        # 18 language-neutral recipes (text in i18n)
│   ├── hooks/
│   │   ├── usePastaCalculator.ts   # Core reactive state machine
│   │   ├── usePantry.tsx           # Flour pantry context
│   │   └── useWakeLock.ts          # Screen wake lock manager
│   ├── i18n/
│   │   ├── index.tsx               # I18nProvider, useTranslation, dir/lang
│   │   ├── types.ts                # Dictionary interface
│   │   ├── format.ts               # Locale numbers, Polish plurals
│   │   ├── en.ts / he.ts / pl.ts   # Dictionaries
│   ├── types/index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── math.ts                 # Snapping, 5g split, boosters, servings, hydration, scaling
│   │   ├── gemini.ts               # Gemini chat + flour vision
│   │   ├── image.ts                # Camera photo downscale
│   │   └── storage.ts              # Safe localStorage helpers
│   ├── App.tsx                     # Main layout & navigation
│   ├── main.tsx
│   └── index.css
├── public/                         # manifest, sw.js, icons
├── CLAUDE.md
├── package.json
└── vite.config.ts
```
