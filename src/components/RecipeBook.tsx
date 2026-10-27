import { useState } from 'react';
import { Clock } from 'lucide-react';
import { CATEGORY_LABELS, DISC_LABELS, RECIPES } from '../data/recipes';
import type { Disc, Recipe, RecipeCategory } from '../types';
import RecipeCard from './RecipeCard';

const TABS: (RecipeCategory | 'all')[] = ['all', 'kids', 'italian', 'asian', 'gourmet'];
const DISCS = Object.keys(DISC_LABELS) as Disc[];

export default function RecipeBook() {
  const [tab, setTab] = useState<RecipeCategory | 'all'>('all');
  const [disc, setDisc] = useState<Disc | null>(null);
  const [open, setOpen] = useState<Recipe | null>(null);

  if (open) return <RecipeCard recipe={open} onBack={() => setOpen(null)} />;

  const visible = RECIPES.filter(
    (r) => (tab === 'all' || r.categories.includes(tab)) && (disc === null || r.disc === disc),
  );

  return (
    <div className="space-y-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === t ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {t === 'all' ? 'All' : CATEGORY_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {DISCS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDisc((cur) => (cur === d ? null : d))}
            aria-pressed={disc === d}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
              disc === d
                ? 'border-emerald-400 bg-emerald-400 text-zinc-950'
                : 'border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10'
            }`}
          >
            {DISC_LABELS[d]}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {visible.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => setOpen(r)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left hover:border-zinc-700"
            >
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-zinc-400">{r.subtitle}</div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-semibold text-emerald-400">
                  {DISC_LABELS[r.disc]}
                </span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <Clock size={12} />
                  {r.minutes} min
                </span>
              </div>
            </button>
          </li>
        ))}
        {visible.length === 0 && <li className="py-8 text-center text-sm text-zinc-500">No recipes match these filters.</li>}
      </ul>
    </div>
  );
}
