import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import type { FlourAnalysis } from '../types';
import { useTranslation } from '../i18n';
import { usePantry } from '../hooks/usePantry';

export default function FlourAnalysisCard({ analysis }: { analysis: FlourAnalysis }) {
  const { t } = useTranslation();
  const { addFromAnalysis } = usePantry();
  const [added, setAdded] = useState(false);

  return (
    <div className="space-y-2 rounded-xl border border-emerald-400/30 bg-zinc-950/60 p-3 text-sm">
      <div>
        <div className="font-semibold text-zinc-100">{analysis.name}</div>
        <div className="text-zinc-400">{analysis.grade}</div>
      </div>
      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-semibold text-emerald-400">
          {analysis.wheat === 'durum' ? t.pantry.durum : t.pantry.soft}
        </span>
        {analysis.proteinPct !== null && (
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-300">{t.pantry.protein(analysis.proteinPct)}</span>
        )}
        {analysis.strengthW !== null && (
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-300">{t.pantry.strength(analysis.strengthW)}</span>
        )}
      </div>
      <div className="font-semibold text-amber-400">{t.pantry.recHydration(analysis.hydrationPct)}</div>
      <p className="text-zinc-300">
        <span className="text-zinc-500">{t.pantry.pairing}: </span>
        {analysis.pairing}
      </p>
      <button
        type="button"
        disabled={added}
        onClick={() => {
          addFromAnalysis(analysis);
          setAdded(true);
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-400 py-2 font-semibold text-zinc-950 hover:bg-amber-300 disabled:bg-emerald-400/20 disabled:text-emerald-400"
      >
        {added ? <Check size={16} /> : <Plus size={16} />}
        {added ? t.pantry.added : t.pantry.add}
      </button>
    </div>
  );
}
