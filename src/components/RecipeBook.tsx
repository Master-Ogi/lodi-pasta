import { useState } from 'react';
import { Clock } from 'lucide-react';
import { RECIPES } from '../data/recipes';
import { DISCS } from '../data/discs';
import { useTranslation } from '../i18n';
import type { Disc, Recipe, RecipeCategory } from '../types';
import RecipeCard from './RecipeCard';

const TABS: (RecipeCategory | 'all')[] = ['all', 'kids', 'italian', 'asian', 'gourmet'];

export default function RecipeBook({ activeDisc }: { activeDisc: Disc }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<RecipeCategory | 'all'>('all');
  const [disc, setDisc] = useState<Disc | null>(null);
  const [open, setOpen] = useState<Recipe | null>(null);

  if (open) return <RecipeCard recipe={open} activeDisc={activeDisc} onBack={() => setOpen(null)} />;

  const visible = RECIPES.filter(
    (r) => (tab === 'all' || r.categories.includes(tab)) && (disc === null || r.discs.includes(disc)),
  );

  return (
    <div className="space-y-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {TABS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setTab(c)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === c ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {t.recipes.categories[c]}
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
            {t.discs[d]}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {visible.map((r) => {
          const text = t.recipes.items[r.id];
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setOpen(r)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-start hover:border-zinc-700"
              >
                <div className="font-semibold">{text.title}</div>
                <div className="text-sm text-zinc-400">{text.subtitle}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {r.discs.map((d) => (
                    <span
                      key={d}
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        d === activeDisc ? 'bg-emerald-400 text-zinc-950' : 'bg-emerald-400/15 text-emerald-400'
                      }`}
                    >
                      {t.discs[d]}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 text-zinc-500">
                    <Clock size={12} />
                    {t.recipes.minutes(r.minutes)}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
        {visible.length === 0 && <li className="py-8 text-center text-sm text-zinc-500">{t.recipes.noMatch}</li>}
      </ul>
    </div>
  );
}
