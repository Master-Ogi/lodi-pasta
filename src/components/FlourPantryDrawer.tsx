import { useState, type ReactNode } from 'react';
import { ChevronDown, Loader2, Plus, Trash2, Warehouse } from 'lucide-react';
import type { BouillonType, FlourAnalysis, FlourProfile, Wheat } from '../types';
import { useTranslation } from '../i18n';
import { flourLabel, usePantry, type NewFlour } from '../hooks/usePantry';
import { analyzeFlour, geminiErrorText } from '../utils/gemini';
import { imageToJpeg } from '../utils/image';
import { STORAGE_KEYS, loadJSON } from '../utils/storage';
import CameraButton from './CameraButton';
import FlourAnalysisCard from './FlourAnalysisCard';

const BOUILLON_TYPES: BouillonType[] = ['paste', 'powder'];

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-emerald-400' : 'bg-zinc-700'}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
          checked ? 'start-[1.125rem]' : 'start-0.5'
        }`}
      />
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
      >
        <h3 className="font-semibold text-zinc-100">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function AddFlourModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { addCustom } = usePantry();
  const [flour, setFlour] = useState<NewFlour>({ name: '', brand: '', wheat: 'durum', inStock: true });
  const roles: { wheat: Wheat; label: string }[] = [
    { wheat: 'durum', label: t.pantry.roleYellow },
    { wheat: 'soft', label: t.pantry.roleRed },
  ];

  const save = () => {
    addCustom(flour);
    onClose();
  };

  return (
    <Modal title={t.pantry.addTitle} onClose={onClose}>
      <label className="block space-y-1 text-sm">
        <span className="text-zinc-400">{t.pantry.nameLabel}</span>
        <input
          value={flour.name}
          onChange={(e) => setFlour((f) => ({ ...f, name: e.target.value }))}
          autoFocus
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-zinc-400">{t.pantry.brandLabel}</span>
        <input
          value={flour.brand}
          onChange={(e) => setFlour((f) => ({ ...f, brand: e.target.value }))}
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
        />
      </label>
      <div className="space-y-1 text-sm">
        <span className="text-zinc-400">{t.pantry.roleLabel}</span>
        <div role="radiogroup" aria-label={t.pantry.roleLabel} className="grid grid-cols-2 gap-2">
          {roles.map(({ wheat, label }) => (
            <button
              key={wheat}
              type="button"
              role="radio"
              aria-checked={flour.wheat === wheat}
              onClick={() => setFlour((f) => ({ ...f, wheat }))}
              className={`rounded-lg px-3 py-2 font-medium ${
                flour.wheat === wheat
                  ? wheat === 'durum'
                    ? 'bg-yellow-400 text-zinc-950'
                    : 'bg-red-400 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-300">
        <Switch
          checked={flour.inStock}
          onChange={() => setFlour((f) => ({ ...f, inStock: !f.inStock }))}
          label={t.pantry.inStock}
        />
        {t.pantry.inStock}
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
          {t.pantry.cancel}
        </button>
        <button
          type="button"
          onClick={save}
          disabled={flour.name.trim() === ''}
          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40"
        >
          {t.pantry.save}
        </button>
      </div>
    </Modal>
  );
}

function FlourRow({ flour, onDelete }: { flour: FlourProfile; onDelete: () => void }) {
  const { t } = useTranslation();
  const { defaults, toggleStock, setDefault } = usePantry();
  const isDefault = defaults[flour.wheat] === flour.id;
  const details = [
    flour.brand,
    flour.grade,
    flour.proteinPct !== null ? t.pantry.protein(flour.proteinPct) : '',
    flour.strengthW !== null ? t.pantry.strength(flour.strengthW) : '',
  ].filter(Boolean);

  return (
    <li className="space-y-2 rounded-lg bg-zinc-950/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="break-words font-semibold">{flour.name}</div>
          {details.length > 0 && <div className="text-xs text-zinc-500">{details.join(' · ')}</div>}
        </div>
        {flour.custom && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={t.pantry.delete}
            className="p-1 text-zinc-500 hover:text-red-300"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-zinc-300">
          <Switch checked={flour.inStock} onChange={() => toggleStock(flour.id)} label={t.pantry.inStock} />
          {t.pantry.inStock}
        </div>
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
  const { flours, remove, bouillon, setBouillon } = usePantry();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<FlourProfile | null>(null);
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
                    <FlourRow key={f.id} flour={f} onDelete={() => setDeleting(f)} />
                  ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
            >
              <Plus size={16} />
              {t.pantry.addFlour}
            </button>
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

          <div className="border-t border-zinc-800 pt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase text-zinc-400">{t.pantry.bouillon.title}</h3>
            <div role="radiogroup" aria-label={t.pantry.bouillon.title} className="grid grid-cols-2 gap-2">
              {BOUILLON_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={bouillon === type}
                  onClick={() => setBouillon(type)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    bouillon === type ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {t.pantry.bouillon[type]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {adding && <AddFlourModal onClose={() => setAdding(false)} />}
      {deleting && (
        <Modal title={t.pantry.deleteConfirm} onClose={() => setDeleting(null)}>
          <p className="text-sm text-zinc-300">{flourLabel(deleting)}</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              className="rounded-lg px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              {t.pantry.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                remove(deleting.id);
                setDeleting(null);
              }}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
            >
              {t.pantry.delete}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
