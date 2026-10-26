import { BLEND_PRESETS } from '../utils/math';
import type { FlourSplit } from '../types';

interface Props {
  yellowPct: number;
  split: FlourSplit;
  onChange: (yellowPct: number) => void;
}

export default function FlourRatioSlider({ yellowPct, split, onChange }: Props) {
  const redPct = 100 - yellowPct;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {BLEND_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.yellowPct)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              yellowPct === preset.yellowPct
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={2.5}
        value={yellowPct}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Yellow flour percentage"
        className="w-full accent-amber-400"
      />

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
          <div className="text-yellow-300">Semola Rimacinata · {yellowPct}%</div>
          <div className="text-2xl font-semibold tabular-nums">{split.yellowG}g</div>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <div className="text-red-300">Cuoco Tipo 00 · {redPct}%</div>
          <div className="text-2xl font-semibold tabular-nums">{split.redG}g</div>
        </div>
      </div>
    </div>
  );
}
