import { useTranslation } from '../i18n';
import type { Servings } from '../types';

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-300">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="h-9 w-9 rounded-lg bg-zinc-800 text-lg hover:bg-zinc-700"
          aria-label={t.calc.fewer(label)}
        >
          −
        </button>
        <span className="w-6 text-center text-lg font-semibold tabular-nums">{t.num(value)}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-9 w-9 rounded-lg bg-zinc-800 text-lg hover:bg-zinc-700"
          aria-label={t.calc.more(label)}
        >
          +
        </button>
      </div>
    </div>
  );
}

interface Props {
  servings: Servings;
  onChange: (patch: Partial<Servings>) => void;
}

/** Adults & Kids counter — shared by the Calculator and recipe cards so both size batches the same way. */
export default function ServingsCounter({ servings, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <Stepper label={t.calc.adults} value={servings.adults} onChange={(adults) => onChange({ adults })} />
      <Stepper label={t.calc.kids} value={servings.kids} onChange={(kids) => onChange({ kids })} />
    </div>
  );
}
