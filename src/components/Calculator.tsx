import { useEffect, useState, type ReactNode } from 'react';
import { AlertTriangle, Droplets, Egg, Scale, Users } from 'lucide-react';
import { usePastaCalculator } from '../hooks/usePastaCalculator';
import {
  FLOUR_MAX_G,
  FLOUR_PRESETS_G,
  HYDRATION_MAX,
  HYDRATION_MIN,
  WASTE_MAX_G,
  WASTE_MIN_G,
  snapFlour,
} from '../utils/math';
import type { SafetyWarning } from '../types';
import FlourRatioSlider from './FlourRatioSlider';

const WARNING_TEXT: Record<SafetyWarning, string> = {
  'red-gummy': 'Red (Tipo 00) above 70% — gummy extrusion risk.',
  'yellow-brittle': '100% Yellow without egg — brittle extrusion risk.',
};

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

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-300">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          className="h-9 w-9 rounded-lg bg-zinc-800 text-lg hover:bg-zinc-700"
          aria-label={`Fewer ${label}`}
        >
          −
        </button>
        <span className="w-6 text-center text-lg font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-9 w-9 rounded-lg bg-zinc-800 text-lg hover:bg-zinc-700"
          aria-label={`More ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function Calculator() {
  const { state, result, setFlour, setHydration, setYellowPct, setEgg, setServings, applyServings } =
    usePastaCalculator();

  // Free-typed flour input; snaps to the nearest 50g batch on blur / Enter.
  const [flourDraft, setFlourDraft] = useState(String(state.flourG));
  useEffect(() => setFlourDraft(String(state.flourG)), [state.flourG]);
  const commitFlour = () => {
    const snapped = snapFlour(Number(flourDraft));
    setFlour(snapped);
    setFlourDraft(String(snapped));
  };

  const { waterToAddG } = result;
  const servingsTooLarge = result.servingsFlourG > FLOUR_MAX_G;

  return (
    <div className="space-y-4">
      <Section icon={<Users size={16} />} title="Servings">
        <div className="space-y-3">
          <Stepper label="Adults" value={state.servings.adults} onChange={(adults) => setServings({ adults })} />
          <Stepper label="Kids" value={state.servings.kids} onChange={(kids) => setServings({ kids })} />
          <label className="flex items-center justify-between">
            <span className="text-zinc-300">Waste allowance (פחת)</span>
            <span className="flex items-center gap-2">
              <input
                type="range"
                min={WASTE_MIN_G}
                max={WASTE_MAX_G}
                value={state.servings.wasteG}
                onChange={(e) => setServings({ wasteG: Number(e.target.value) })}
                className="w-24 accent-amber-400"
              />
              <span className="w-10 text-right tabular-nums">{state.servings.wasteG}g</span>
            </span>
          </label>
          <button
            type="button"
            onClick={applyServings}
            className="w-full rounded-lg bg-amber-400 py-2.5 font-semibold text-zinc-950 hover:bg-amber-300"
          >
            Use {Math.min(result.servingsFlourG, FLOUR_MAX_G)}g flour
          </button>
          {servingsTooLarge && (
            <p className="text-sm text-amber-300">
              Needs {result.servingsFlourG}g — above the {FLOUR_MAX_G}g max. Split into multiple batches.
            </p>
          )}
        </div>
      </Section>

      <Section icon={<Scale size={16} />} title="Flour">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={flourDraft}
              onChange={(e) => setFlourDraft(e.target.value)}
              onBlur={commitFlour}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              aria-label="Total flour in grams"
              className="w-28 rounded-lg bg-zinc-800 px-3 py-2 text-3xl font-semibold tabular-nums outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-xl text-zinc-400">g</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {FLOUR_PRESETS_G.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setFlour(g)}
                className={`rounded-lg px-3 py-1.5 text-sm tabular-nums ${
                  state.flourG === g ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <FlourRatioSlider yellowPct={state.yellowPct} split={result.split} onChange={setYellowPct} />
        </div>
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
              {WARNING_TEXT[w]}
            </div>
          ))}
        </div>
      )}

      <Section icon={<Droplets size={16} />} title="Liquid">
        <div className="space-y-3">
          <label className="block">
            <div className="flex justify-between text-zinc-300">
              <span>Hydration</span>
              <span className="tabular-nums">{(state.hydration * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={HYDRATION_MIN}
              max={HYDRATION_MAX}
              step={0.005}
              value={state.hydration}
              onChange={(e) => setHydration(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </label>
          <div className="flex items-baseline justify-between">
            <span className="text-zinc-300">Total liquid target</span>
            <span className="text-3xl font-semibold tabular-nums">{result.liquidTargetG}g</span>
          </div>
        </div>
      </Section>

      <Section icon={<Egg size={16} />} title="Scale">
        <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-zinc-400">
          <li>Tare your measuring vessel (0g).</li>
          <li>Crack egg(s) in and enter the weight.</li>
          <li>Top up with water to the amount below.</li>
        </ol>
        <div className="mb-4 flex items-baseline gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={state.eggG === 0 ? '' : state.eggG}
            placeholder="0"
            onChange={(e) => setEgg(Number(e.target.value))}
            aria-label="Egg weight in grams"
            className="w-28 rounded-lg bg-zinc-800 px-3 py-2 text-3xl font-semibold tabular-nums outline-none focus:ring-2 focus:ring-amber-400"
          />
          <span className="text-xl text-zinc-400">g egg</span>
        </div>
        {waterToAddG >= 0 ? (
          <div className="rounded-xl bg-amber-400/10 p-4 text-center">
            <div className="text-sm uppercase tracking-wide text-amber-300">Water to add</div>
            <div className="text-5xl font-bold tabular-nums text-amber-400">{waterToAddG}g</div>
          </div>
        ) : (
          <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center text-red-200">
            Eggs exceed the liquid target by {-waterToAddG}g. Remove some egg — add no water.
          </div>
        )}
      </Section>
    </div>
  );
}
