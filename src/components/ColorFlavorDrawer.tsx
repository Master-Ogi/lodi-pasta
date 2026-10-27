import { useEffect, useState } from 'react';
import { ChevronDown, Droplets, Palette, Wheat } from 'lucide-react';
import { COLOR_FLAVORS } from '../data/colors';
import { scaleColorDose } from '../utils/math';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage';
import { useTranslation } from '../i18n';
import type { ColorAddition, ColorId } from '../types';

interface Props {
  flourG: number;
  /** Water portion of the liquid (spinach juice replaces it 1:1) */
  waterG: number;
}

function ZoneBadge({ zone }: { zone: ColorAddition['zone'] }) {
  const { t } = useTranslation();
  return zone === 'dry' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-semibold text-amber-300">
      <Wheat size={12} />
      {t.color.zone.dry}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-400/15 px-2 py-0.5 text-xs font-semibold text-sky-300">
      <Droplets size={12} />
      {t.color.zone.liquid}
    </span>
  );
}

export default function ColorFlavorDrawer({ flourG, waterG }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ColorId[]>(() => loadJSON<ColorId[]>(STORAGE_KEYS.colors, []));

  useEffect(() => saveJSON(STORAGE_KEYS.colors, selected), [selected]);

  const toggle = (id: ColorId) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const active = COLOR_FLAVORS.filter((c) => selected.includes(c.id));

  const amount = (a: ColorAddition): string => {
    if (a.replacesWater) return `${t.g(waterG)} · ${t.color.replacesWater}`;
    const spoon = a.spoon && `${t.num(scaleColorDose(a.spoon.qty, flourG))} ${t.units[a.spoon.unit](scaleColorDose(a.spoon.qty, flourG))}`;
    if (a.grams !== undefined) return spoon ? `${t.g(scaleColorDose(a.grams, flourG))} (≈ ${spoon})` : t.g(scaleColorDose(a.grams, flourG));
    return spoon ?? '';
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between p-4"
      >
        <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-400">
          <Palette size={16} />
          {t.color.title}
          {active.length > 0 && (
            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-xs text-zinc-950">{t.num(active.length)}</span>
          )}
        </span>
        <ChevronDown size={18} className={`text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="space-y-4 px-4 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {COLOR_FLAVORS.map((c) => {
              const on = selected.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-start text-sm transition-colors ${
                    on ? 'border-amber-400 bg-amber-400/10 text-zinc-100' : 'border-zinc-800 bg-zinc-800/50 text-zinc-300'
                  }`}
                >
                  <span className={`h-4 w-4 shrink-0 rounded-full ${c.swatch}`} />
                  {t.color.items[c.id]}
                </button>
              );
            })}
          </div>

          {active.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">{t.color.forFlour(flourG)}</p>
              {active.map((c) => (
                <div key={c.id} className="space-y-2 rounded-lg bg-zinc-950/60 p-3">
                  <div className="text-sm font-semibold">{t.color.items[c.id]}</div>
                  {c.additions.map((a) => (
                    <div key={a.id} className="space-y-1">
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-zinc-300">{t.color.additions[a.id]}</span>
                        <span className="shrink-0 font-semibold tabular-nums text-amber-400">{amount(a)}</span>
                      </div>
                      <ZoneBadge zone={a.zone} />
                    </div>
                  ))}
                  <p className="text-xs text-zinc-500">{t.color.notes[c.id]}</p>
                </div>
              ))}
              <p className="text-xs text-zinc-500">{t.color.absorbNote}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
