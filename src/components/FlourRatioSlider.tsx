import { BLEND_PRESETS } from '../utils/math';
import { useTranslation } from '../i18n';
import type { FlourSplit } from '../types';

interface Props {
  yellowPct: number;
  split: FlourSplit;
  yellowName: string;
  redName: string;
  onChange: (yellowPct: number) => void;
}

export default function FlourRatioSlider({ yellowPct, split, yellowName, redName, onChange }: Props) {
  const { t } = useTranslation();
  // Shares come from the weighed grams (5g-rounded, boosters deducted), to one decimal.
  const totalG = split.yellowG + split.redG + split.lentilG + split.tapiocaG;
  const share = (grams: number) => (totalG > 0 ? Math.round((grams / totalG) * 1000) / 10 : 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {BLEND_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.yellowPct)}
            aria-pressed={yellowPct === preset.yellowPct}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              yellowPct === preset.yellowPct
                ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-300/60'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {t.calc.presets[preset.id]}
          </button>
        ))}
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={yellowPct}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={t.calc.ratioAria}
        className="w-full accent-amber-400"
      />

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="min-w-0 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
          <div className="truncate text-yellow-300">{yellowName}</div>
          <div className="text-xs text-yellow-300/70">{t.num(share(split.yellowG))}%</div>
          <div className="text-2xl font-semibold tabular-nums">{t.g(split.yellowG)}</div>
        </div>
        <div className="min-w-0 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <div className="truncate text-red-300">{redName}</div>
          <div className="text-xs text-red-300/70">{t.num(share(split.redG))}%</div>
          <div className="text-2xl font-semibold tabular-nums">{t.g(split.redG)}</div>
        </div>
      </div>
    </div>
  );
}
