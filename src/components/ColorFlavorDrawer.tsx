import { useState } from 'react';
import { ChevronDown, Palette } from 'lucide-react';
import { COLOR_FLAVORS } from '../data/colors';
import { additionForFlour } from '../utils/math';
import type { ColorFlavor } from '../types';

export default function ColorFlavorDrawer({ flourG }: { flourG: number }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ColorFlavor['id'][]>([]);

  const toggle = (id: ColorFlavor['id']) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const active = COLOR_FLAVORS.filter((c) => selected.includes(c.id));

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
          Natural Color & Flavor
          {active.length > 0 && (
            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-xs text-zinc-950">{active.length}</span>
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
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    on ? 'border-amber-400 bg-amber-400/10 text-zinc-100' : 'border-zinc-800 bg-zinc-800/50 text-zinc-300'
                  }`}
                >
                  <span className={`h-4 w-4 shrink-0 rounded-full ${c.swatch}`} />
                  {c.label}
                </button>
              );
            })}
          </div>

          {active.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">For {flourG}g flour</p>
              {active.map((c) => (
                <div key={c.id} className="rounded-lg bg-zinc-950/60 p-3">
                  <div className="mb-1 text-sm font-semibold">{c.label}</div>
                  {c.additions.map((a) => (
                    <div key={a.name} className="flex justify-between text-sm">
                      <span className="text-zinc-300">{a.name}</span>
                      <span className="font-semibold tabular-nums text-amber-400">
                        {additionForFlour(a.per100, flourG)}
                        {a.unit}
                      </span>
                    </div>
                  ))}
                  <p className="mt-1 text-xs text-zinc-500">{c.note}</p>
                </div>
              ))}
              <p className="text-xs text-zinc-500">
                Powders absorb a little liquid. If the dough looks dry after 3 minutes of mixing, add water 5g at a time.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
