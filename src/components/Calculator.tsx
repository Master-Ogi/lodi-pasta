import { useEffect, useState, type ReactNode } from 'react';
import { AlertTriangle, CircleDot, Droplets, RotateCcw, Scale, SlidersHorizontal, Sparkles, Sprout, Timer, Users } from 'lucide-react';
import { usePastaCalculator } from '../hooks/usePastaCalculator';
import { usePantry } from '../hooks/usePantry';
import { useTranslation } from '../i18n';
import {
  FLOUR_MAX_G,
  FLOUR_PRESETS_G,
  HYDRATION_MAX,
  HYDRATION_MIN,
  HYDRATION_STEP,
  hydrationFeel,
  isGoldenSpot,
  snapFlour,
} from '../utils/math';
import { BOIL_MINUTES, DISCS } from '../data/discs';
import type { Disc } from '../types';
import FlourRatioSlider from './FlourRatioSlider';
import ColorFlavorDrawer from './ColorFlavorDrawer';
import FlourPantryDrawer from './FlourPantryDrawer';
import FlourBoosters from './FlourBoosters';
import ServingsCounter from './ServingsCounter';

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-400">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

interface Props {
  disc: Disc;
  onDiscChange: (disc: Disc) => void;
}

export default function Calculator({ disc, onDiscChange }: Props) {
  const { t } = useTranslation();
  const { defaultYellow, defaultRed } = usePantry();
  const {
    state,
    result,
    setFlour,
    setHydration,
    resetHydration,
    setYellowPct,
    setEgg,
    setServings,
    applyServings,
    toggleBooster,
  } = usePastaCalculator();

  // Free-typed flour input; snaps to the nearest 50g batch on blur / Enter.
  const [flourDraft, setFlourDraft] = useState(String(state.flourG));
  useEffect(() => setFlourDraft(String(state.flourG)), [state.flourG]);
  const commitFlour = () => {
    const snapped = snapFlour(Number(flourDraft));
    setFlour(snapped);
    setFlourDraft(String(snapped));
  };

  const [fineTune, setFineTune] = useState(false);
  const golden = isGoldenSpot(state.hydration);
  const feel = t.calc.feel[hydrationFeel(state.hydration)];

  const { waterToAddG } = result;
  const servingsTooLarge = result.servingsFlourG > FLOUR_MAX_G;
  const [boilMin, boilMax] = BOIL_MINUTES[disc];

  return (
    <div className="space-y-4">
      <Section icon={<Users size={16} />} title={t.calc.servings}>
        <div className="space-y-3">
          <ServingsCounter servings={state.servings} onChange={setServings} />
          <p className="text-xs text-zinc-500">{t.calc.servingsHint}</p>
          <button
            type="button"
            onClick={applyServings}
            className="w-full rounded-lg bg-amber-400 py-2.5 font-semibold text-zinc-950 hover:bg-amber-300"
          >
            {t.calc.useFlour(Math.min(result.servingsFlourG, FLOUR_MAX_G))}
          </button>
          {servingsTooLarge && <p className="text-sm text-amber-300">{t.calc.tooLarge(result.servingsFlourG, FLOUR_MAX_G)}</p>}
        </div>
      </Section>

      <Section icon={<Scale size={16} />} title={t.calc.flour}>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              inputMode="numeric"
              dir="ltr"
              value={flourDraft}
              onChange={(e) => setFlourDraft(e.target.value)}
              onBlur={commitFlour}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              aria-label={t.calc.flourAria}
              className="w-28 rounded-lg bg-zinc-800 px-3 py-2 text-3xl font-semibold tabular-nums outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-xl text-zinc-400">{t.units.g(0)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {FLOUR_PRESETS_G.map((grams) => (
              <button
                key={grams}
                type="button"
                onClick={() => setFlour(grams)}
                className={`rounded-lg px-3 py-1.5 text-sm tabular-nums ${
                  state.flourG === grams ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {t.num(grams)}
              </button>
            ))}
          </div>
          <FlourRatioSlider
            yellowPct={state.yellowPct}
            split={result.split}
            yellowName={defaultYellow?.name ?? t.calc.yellowFallback}
            redName={defaultRed?.name ?? t.calc.redFallback}
            onChange={setYellowPct}
          />
        </div>
      </Section>

      <Section icon={<Sprout size={16} />} title={t.calc.boosters.title}>
        <FlourBoosters boosters={state.boosters} split={result.split} onToggle={toggleBooster} />
      </Section>

      {result.warnings.length > 0 && (
        <div className="space-y-2">
          {result.warnings.map((w) => (
            <div
              key={w}
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200"
            >
              <AlertTriangle size={18} className="shrink-0" />
              {t.calc.warnings[w]}
            </div>
          ))}
        </div>
      )}

      <FlourPantryDrawer />

      <ColorFlavorDrawer flourG={state.flourG} waterG={state.eggG > 0 ? Math.max(0, waterToAddG) : result.liquidTargetG} />

      <Section icon={<Droplets size={16} />} title={t.calc.liquid}>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm text-zinc-400">{t.calc.totalLiquid}</div>
            <div className="text-6xl font-bold tabular-nums text-amber-400">{t.g(result.liquidTargetG)}</div>
            <div className="mt-2 flex justify-center">
              {golden ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <Sparkles size={12} />
                  {t.calc.golden}
                </span>
              ) : (
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300">
                  {t.calc.custom(state.hydration * 100)}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-zinc-950/60 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{feel.label}</span>
              <button
                type="button"
                onClick={() => setFineTune((f) => !f)}
                aria-expanded={fineTune}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
              >
                <SlidersHorizontal size={14} />
                {t.calc.fineTune}
              </button>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{feel.detail}</p>
            {fineTune && (
              <div className="mt-3 space-y-2">
                <input
                  type="range"
                  min={HYDRATION_MIN}
                  max={HYDRATION_MAX}
                  step={HYDRATION_STEP}
                  value={state.hydration}
                  onChange={(e) => setHydration(Number(e.target.value))}
                  aria-label={t.calc.hydrationAria}
                  className="w-full accent-amber-400"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{t.calc.firmEnd}</span>
                  <span>{t.calc.softEnd}</span>
                </div>
                {!golden && (
                  <button
                    type="button"
                    onClick={resetHydration}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-400"
                  >
                    <RotateCcw size={12} />
                    {t.calc.reset}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <label className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-zinc-300">{t.calc.tareEgg}</span>
                <span className="text-xs text-zinc-500">{t.calc.tareHint}</span>
              </span>
              <span className="flex items-baseline gap-1">
                <input
                  type="number"
                  inputMode="numeric"
                  dir="ltr"
                  min={0}
                  value={state.eggG === 0 ? '' : state.eggG}
                  placeholder="0"
                  onChange={(e) => setEgg(Number(e.target.value))}
                  aria-label={t.calc.eggAria}
                  className="w-24 rounded-lg bg-zinc-800 px-3 py-2 text-end text-2xl font-semibold tabular-nums outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="text-zinc-400">{t.units.g(0)}</span>
              </span>
            </label>

            {state.eggG > 0 &&
              (waterToAddG >= 0 ? (
                <div className="mt-3 rounded-xl bg-amber-400/10 p-4 text-center">
                  <div className="text-sm uppercase tracking-wide text-amber-300">{t.calc.waterToAdd}</div>
                  <div className="text-5xl font-bold tabular-nums text-amber-400">{t.g(waterToAddG)}</div>
                </div>
              ) : (
                <div
                  role="alert"
                  className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center text-red-200"
                >
                  {t.calc.eggsExceed(-waterToAddG)}
                </div>
              ))}
          </div>
        </div>
      </Section>

      <Section icon={<CircleDot size={16} />} title={t.calc.disc}>
        <div className="space-y-3">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {DISCS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onDiscChange(d)}
                aria-pressed={disc === d}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
                  disc === d ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {t.discs[d]}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 rounded-xl bg-emerald-400/10 p-4">
            <Timer size={28} className="text-emerald-400" />
            <div>
              <div className="text-sm text-emerald-300">
                {t.calc.boil} · {t.discs[disc]}
              </div>
              <div className="text-4xl font-bold tabular-nums text-emerald-400">{t.calc.boilRange(boilMin, boilMax)}</div>
              {disc === 'lasagna' && <div className="text-xs text-emerald-300/80">{t.calc.lasagnaNote}</div>}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
