import { useState } from 'react';
import { ChevronDown, Loader2, Trash2, Warehouse } from 'lucide-react';
import type { FlourAnalysis, FlourProfile, Wheat } from '../types';
import { useTranslation } from '../i18n';
import { usePantry } from '../hooks/usePantry';
import { analyzeFlour, geminiErrorText } from '../utils/gemini';
import { imageToJpeg } from '../utils/image';
import { STORAGE_KEYS, loadJSON } from '../utils/storage';
import CameraButton from './CameraButton';
import FlourAnalysisCard from './FlourAnalysisCard';

function FlourRow({ flour }: { flour: FlourProfile }) {
  const { t } = useTranslation();
  const { defaults, toggleStock, setDefault, remove } = usePantry();
  const isDefault = defaults[flour.wheat] === flour.id;

  return (
    <li className="space-y-2 rounded-lg bg-zinc-950/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-semibold">{flour.name}</div>
          <div className="text-xs text-zinc-500">
            {flour.grade}
            {flour.proteinPct !== null && ` · ${t.pantry.protein(flour.proteinPct)}`}
            {flour.strengthW !== null && ` · ${t.pantry.strength(flour.strengthW)}`}
          </div>
        </div>
        {flour.custom && (
          <button
            type="button"
            onClick={() => remove(flour.id)}
            aria-label={t.pantry.remove}
            className="text-zinc-500 hover:text-red-300"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-zinc-300">
          <button
            type="button"
            role="switch"
            aria-checked={flour.inStock}
            onClick={() => toggleStock(flour.id)}
            className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
              flour.inStock ? 'bg-emerald-400' : 'bg-zinc-700'
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                flour.inStock ? 'start-[1.125rem]' : 'start-0.5'
              }`}
            />
          </button>
          {t.pantry.inStock}
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-zinc-300">
          <input
            type="radio"
            name={`default-${flour.wheat}`}
            checked={isDefault}
            onChange={() => setDefault(flour.id)}
            className="accent-amber-400"
          />
          {t.pantry.setDefault}
        </label>
      </div>
    </li>
  );
}

export default function FlourPantryDrawer() {
  const { t } = useTranslation();
  const { flours } = usePantry();
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<FlourAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = async (file: File) => {
    const apiKey = loadJSON<string>(STORAGE_KEYS.geminiKey, '');
    if (!apiKey) {
      setError(t.pantry.needKey);
      return;
    }
    setScanning(true);
    setError(null);
    setResult(null);
    try {
      const { base64 } = await imageToJpeg(file);
      setResult(await analyzeFlour(apiKey, base64, t.languageName));
    } catch (err) {
      setError(geminiErrorText(err, t));
    } finally {
      setScanning(false);
    }
  };

  const roles: { wheat: Wheat; label: string }[] = [
    { wheat: 'durum', label: t.pantry.yellowRole },
    { wheat: 'soft', label: t.pantry.redRole },
  ];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between p-4"
      >
        <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-400">
          <Warehouse size={16} />
          {t.pantry.title}
        </span>
        <ChevronDown size={18} className={`text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="space-y-4 px-4 pb-4">
          {roles.map(({ wheat, label }) => (
            <div key={wheat}>
              <h3 className={`mb-2 text-xs font-semibold uppercase ${wheat === 'durum' ? 'text-yellow-300' : 'text-red-300'}`}>
                {label}
              </h3>
              <ul className="space-y-2">
                {flours
                  .filter((f) => f.wheat === wheat)
                  .map((f) => (
                    <FlourRow key={f.id} flour={f} />
                  ))}
              </ul>
            </div>
          ))}

          <div className="flex items-center gap-3">
            <CameraButton label={t.pantry.camera} disabled={scanning} onCapture={(f) => void scan(f)} />
            {scanning && (
              <span className="flex items-center gap-2 text-sm text-zinc-400">
                <Loader2 size={14} className="animate-spin" />
                {t.pantry.scanning}
              </span>
            )}
          </div>
          {error && (
            <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </p>
          )}
          {result && <FlourAnalysisCard analysis={result} />}
        </div>
      )}
    </section>
  );
}
