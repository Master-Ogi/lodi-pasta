import { ArrowLeft, Clock, Lightbulb, Timer } from 'lucide-react';
import type { Disc, IngredientAmount, Recipe } from '../types';
import { useTranslation } from '../i18n';
import { formatFraction } from '../i18n/format';
import { BOIL_MINUTES } from '../data/discs';
import { usePastaCalculator } from '../hooks/usePastaCalculator';
import { usePantry } from '../hooks/usePantry';
import { FLOUR_MAX_G, bouillonTsp, kitchenVolume, recipeBaseFlour, scaleQty } from '../utils/math';
import ServingsCounter from './ServingsCounter';

interface Props {
  recipe: Recipe;
  activeDisc: Disc;
  onBack: () => void;
}

export default function RecipeCard({ recipe, activeDisc, onBack }: Props) {
  const { t } = useTranslation();
  const { bouillon } = usePantry();
  // Shared with the Calculator: same Adults & Kids, same flour batch, both ways.
  const { state, result, setServings } = usePastaCalculator();
  const text = t.recipes.items[recipe.id];
  const flourG = state.flourG;
  // Sauce scales with the pasta actually made, relative to the flour the recipe was written for.
  const factor = flourG / recipeBaseFlour(recipe.baseServings);

  // The calculator's active disc leads the pairings when it suits this dish.
  const paired = recipe.discs.includes(activeDisc);
  const pairings = paired ? [activeDisc, ...recipe.discs.filter((d) => d !== activeDisc)] : recipe.discs;
  const [boilMin, boilMax] = BOIL_MINUTES[pairings[0]];
  const boilNote = t.calc.boilNotes[pairings[0]];

  const measure = (qty: number, unit: IngredientAmount['unit']) =>
    unit === 'g' ? t.g(qty) : `${t.num(qty)} ${unit ? t.units[unit](qty) : ''}`;
  const kitchen = (qty: number, unit: NonNullable<IngredientAmount['unit']>) =>
    `${formatFraction(qty, t.locale)} ${t.units[unit](qty)}`;

  // Bouillon rows become "warm water + dissolved bouillon" from the pantry's stock-base setting.
  const stock = recipe.ingredients.find((ing) => ing.stock && ing.qty !== undefined);
  const stockParts = (ing: IngredientAmount) => {
    const waterMl = scaleQty(ing.qty ?? 0, factor, 'ml');
    return { water: measure(waterMl, 'ml'), dose: kitchen(bouillonTsp(waterMl, bouillon), 'tsp') };
  };
  const steps = stock
    ? [t.recipes.bouillonStep[bouillon](stockParts(stock).water, stockParts(stock).dose), ...text.steps]
    : text.steps;

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
          <Timer size={16} className="shrink-0" />
          <span>
            {t.discs[pairings[0]]}: {t.recipes.boilFor(t.calc.boilRange(boilMin, boilMax))}
            {boilNote && <span className="font-normal text-emerald-300/80"> ({boilNote})</span>}
          </span>
        </p>
        {!paired && <p className="text-xs text-zinc-500">{t.recipes.notPaired(t.discs[activeDisc])}</p>}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-400">{t.calc.servings}</h3>
        <ServingsCounter servings={state.servings} onChange={setServings} />
        <p className="mt-3 text-sm font-semibold text-amber-400">{t.recipes.flourBatch(flourG)}</p>
        {result.servingsNeededG > FLOUR_MAX_G && (
          <p className="mt-1 text-sm text-amber-300">{t.calc.tooLarge(result.servingsNeededG, FLOUR_MAX_G)}</p>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-400">{t.recipes.ingredients}</h3>
        <ul className="divide-y divide-zinc-800">
          {recipe.ingredients.map((ing, i) => {
            if (ing.stock) {
              const { water, dose } = stockParts(ing);
              return (
                <li key={i} className="py-2 text-sm text-zinc-200">
                  {t.recipes.stockLine(water, dose, t.recipes.bouillonName[bouillon])}
                </li>
              );
            }
            const qty = ing.qty === undefined ? undefined : scaleQty(ing.qty, factor, ing.unit);
            const volume = qty === undefined ? null : kitchenVolume(qty, ing.unit, ing.cupG);
            return (
              <li key={i} className="flex justify-between gap-3 py-2 text-sm">
                <span className="text-zinc-200">{text.ingredients[i]}</span>
                <span className="shrink-0 text-end tabular-nums text-zinc-400">
                  {qty === undefined ? t.recipes.toTaste : measure(qty, ing.unit)}
                  {volume && (
                    <span className="block text-xs text-zinc-500">{t.recipes.approx(kitchen(volume.qty, volume.unit))}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-400">{t.recipes.method}</h3>
        <ol className="list-decimal space-y-2 ps-5 text-sm text-zinc-300">
          {steps.map((step) => (
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
