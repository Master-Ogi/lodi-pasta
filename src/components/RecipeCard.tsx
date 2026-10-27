import { useState } from 'react';
import { ArrowLeft, Clock, Lightbulb, Timer } from 'lucide-react';
import type { Disc, Recipe, Servings } from '../types';
import { useTranslation } from '../i18n';
import { BOIL_MINUTES } from '../data/discs';
import { FLOUR_MAX_G, flourForServings, recipeBaseFlour, scaleQty } from '../utils/math';
import { STORAGE_KEYS, loadJSON } from '../utils/storage';
import ServingsCounter from './ServingsCounter';

/** Start from the Calculator's last saved Adults & Kids, else the recipe's base as adults. */
function initialServings(baseServings: number): Servings {
  const saved = loadJSON<{ servings?: Partial<Servings> }>(STORAGE_KEYS.calculator, {}).servings;
  const adults = Math.max(0, Math.round(Number(saved?.adults) || 0));
  const kids = Math.max(0, Math.round(Number(saved?.kids) || 0));
  return adults + kids > 0 ? { adults, kids } : { adults: baseServings, kids: 0 };
}

interface Props {
  recipe: Recipe;
  activeDisc: Disc;
  onBack: () => void;
}

export default function RecipeCard({ recipe, activeDisc, onBack }: Props) {
  const { t } = useTranslation();
  const text = t.recipes.items[recipe.id];
  const [servings, setServings] = useState<Servings>(() => initialServings(recipe.baseServings));
  // Same engine as the Calculator: Adults×120g + Kids×70g, up to the next 50g batch.
  // Sauce scales with the pasta actually made, relative to the flour the recipe was written for.
  const flourG = flourForServings(servings);
  const factor = flourG / recipeBaseFlour(recipe.baseServings);

  // The calculator's active disc leads the pairings when it suits this dish.
  const paired = recipe.discs.includes(activeDisc);
  const pairings = paired ? [activeDisc, ...recipe.discs.filter((d) => d !== activeDisc)] : recipe.discs;
  const [boilMin, boilMax] = BOIL_MINUTES[pairings[0]];

  return (
    <article className="space-y-4">
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="rtl:rotate-180" />
        {t.recipes.back}
      </button>

      <header>
        <h2 className="text-2xl font-bold">{text.title}</h2>
        <p className="text-zinc-400">{text.subtitle}</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
          <Clock size={12} />
          {t.recipes.minutes(recipe.minutes)}
        </span>
      </header>

      <section className="space-y-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">{t.recipes.pairings}</h3>
        <div className="flex flex-wrap gap-2">
          {pairings.map((d, i) => (
            <span
              key={d}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                i === 0 ? 'bg-emerald-400 text-zinc-950' : 'bg-emerald-400/15 text-emerald-400'
              }`}
            >
              {t.discs[d]}
              {paired && d === activeDisc && ` · ${t.recipes.yourDisc}`}
            </span>
          ))}
        </div>
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <Timer size={16} />
          {t.discs[pairings[0]]}: {t.recipes.boilFor(t.calc.boilRange(boilMin, boilMax))}
          {pairings[0] === 'lasagna' && <span className="font-normal text-emerald-300/80">({t.calc.lasagnaNote})</span>}
        </p>
        {!paired && <p className="text-xs text-zinc-500">{t.recipes.notPaired(t.discs[activeDisc])}</p>}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-400">{t.calc.servings}</h3>
        <ServingsCounter servings={servings} onChange={(patch) => setServings((s) => ({ ...s, ...patch }))} />
        <p className="mt-3 text-sm font-semibold text-amber-400">{t.recipes.flourBatch(flourG)}</p>
        {flourG > FLOUR_MAX_G && <p className="mt-1 text-sm text-amber-300">{t.calc.tooLarge(flourG, FLOUR_MAX_G)}</p>}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-400">{t.recipes.ingredients}</h3>
        <ul className="divide-y divide-zinc-800">
          {recipe.ingredients.map((ing, i) => {
            const qty = ing.qty === undefined ? undefined : scaleQty(ing.qty, factor, ing.unit);
            return (
              <li key={i} className="flex justify-between gap-3 py-2 text-sm">
                <span className="text-zinc-200">{text.ingredients[i]}</span>
                <span className="shrink-0 tabular-nums text-zinc-400">
                  {qty === undefined ? t.recipes.toTaste : `${t.num(qty)} ${ing.unit ? t.units[ing.unit](qty) : ''}`}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-400">{t.recipes.method}</h3>
        <ol className="list-decimal space-y-2 ps-5 text-sm text-zinc-300">
          {text.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-2 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4">
        {text.tips.map((tip) => (
          <p key={tip} className="flex gap-2 text-sm text-amber-100">
            <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-400" />
            {tip}
          </p>
        ))}
      </section>
    </article>
  );
}
