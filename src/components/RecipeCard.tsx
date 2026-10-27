import { useState } from 'react';
import { ArrowLeft, Clock, Lightbulb } from 'lucide-react';
import type { Recipe } from '../types';
import { DISC_LABELS } from '../data/recipes';
import { ADULT_PORTION_G, WASTE_DEFAULT_G, flourForServings, scaleQty } from '../utils/math';

interface Props {
  recipe: Recipe;
  onBack: () => void;
}

export default function RecipeCard({ recipe, onBack }: Props) {
  const [servings, setServings] = useState(recipe.baseServings);
  const factor = servings / recipe.baseServings;
  const flourG = flourForServings({ adults: servings, kids: 0, wasteG: WASTE_DEFAULT_G });

  return (
    <article className="space-y-4">
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} />
        All recipes
      </button>

      <header>
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <p className="text-zinc-400">{recipe.subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 font-semibold text-emerald-400">
            {DISC_LABELS[recipe.disc]} disc
          </span>
          <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-300">
            <Clock size={12} />
            {recipe.minutes} min
          </span>
        </div>
      </header>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center justify-between">
          <span className="text-zinc-300">Servings</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="h-9 w-9 rounded-lg bg-zinc-800 text-lg hover:bg-zinc-700"
              aria-label="Fewer servings"
            >
              −
            </button>
            <span className="w-6 text-center text-lg font-semibold tabular-nums">{servings}</span>
            <button
              type="button"
              onClick={() => setServings((s) => Math.min(12, s + 1))}
              className="h-9 w-9 rounded-lg bg-zinc-800 text-lg hover:bg-zinc-700"
              aria-label="More servings"
            >
              +
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          Fresh pasta ≈ {servings * ADULT_PORTION_G}g → flour batch{' '}
          <span className="font-semibold text-amber-400">{flourG}g</span>
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-400">Ingredients</h3>
        <ul className="divide-y divide-zinc-800">
          {recipe.ingredients.map((ing) => (
            <li key={ing.item} className="flex justify-between gap-3 py-2 text-sm">
              <span className="text-zinc-200">{ing.item}</span>
              <span className="shrink-0 tabular-nums text-zinc-400">
                {ing.qty === undefined ? 'to taste' : `${scaleQty(ing.qty, factor, ing.unit)} ${ing.unit ?? ''}`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-400">Method</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-300">
          {recipe.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-2 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4">
        {recipe.tips.map((tip) => (
          <p key={tip} className="flex gap-2 text-sm text-amber-100">
            <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-400" />
            {tip}
          </p>
        ))}
      </section>
    </article>
  );
}
