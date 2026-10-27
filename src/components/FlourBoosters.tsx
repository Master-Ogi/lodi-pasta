import { Check } from 'lucide-react';
import { useTranslation } from '../i18n';
import { BOOSTER_PCT } from '../utils/math';
import type { BoosterId, Boosters, FlourSplit } from '../types';

const BOOSTERS: { id: BoosterId; grams: (split: FlourSplit) => number; active: string; badge: string }[] = [
  {
    id: 'lentil',
    grams: (split) => split.lentilG,
    active: 'border-orange-400/50 bg-orange-400/10',
    badge: 'bg-orange-400/15 text-orange-300',
  },
  {
    id: 'tapioca',
    grams: (split) => split.tapiocaG,
    active: 'border-sky-400/50 bg-sky-400/10',
    badge: 'bg-sky-400/15 text-sky-300',
  },
];

interface Props {
  boosters: Boosters;
  split: FlourSplit;
  onToggle: (id: BoosterId) => void;
}

export default function FlourBoosters({ boosters, split, onToggle }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      {BOOSTERS.map(({ id, grams, active, badge }) => {
        const on = boosters[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            aria-pressed={on}
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-start ${
              on ? active : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                on ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800'
              }`}
            >
              {on && <Check size={16} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-zinc-100">
                {t.calc.boosters.names[id]} · {t.num(BOOSTER_PCT[id])}%
              </span>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${badge}`}>
                {t.calc.boosters.badges[id]}
              </span>
            </span>
            {on && <span className="shrink-0 text-xl font-semibold tabular-nums">{t.g(grams(split))}</span>}
          </button>
        );
      })}
      <p className="text-xs text-zinc-500">{t.calc.boosters.hint}</p>
    </div>
  );
}
