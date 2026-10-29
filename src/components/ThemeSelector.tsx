import { useEffect, useState } from 'react';
import { Check, Palette, X } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useTheme } from '../hooks/useTheme';
import { THEMES, type ThemeSpec } from '../data/themes';

/** Miniature of the app drawn in the theme's own colors, so every option previews truthfully. */
function ThemePreview({ spec }: { spec: ThemeSpec }) {
  return (
    <div
      aria-hidden
      className="flex h-16 w-20 shrink-0 flex-col gap-1 rounded-lg p-1.5"
      style={{ background: spec.bg, boxShadow: `inset 0 0 0 1px ${spec.border}` }}
    >
      <div className="h-1.5 w-8 rounded-full" style={{ background: spec.accent }} />
      <div className="flex flex-1 flex-col justify-center gap-1 rounded-md px-1.5" style={{ background: spec.card, boxShadow: `inset 0 0 0 1px ${spec.border}` }}>
        <div className="h-1 w-10 rounded-full" style={{ background: spec.text }} />
        <div className="h-1 w-7 rounded-full" style={{ background: spec.muted }} />
      </div>
      <div className="mx-auto h-1.5 w-12 rounded-full" style={{ background: spec.card, boxShadow: `inset 0 0 0 1px ${spec.border}` }} />
    </div>
  );
}

export default function ThemeSelector() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.theme.open}
        aria-haspopup="dialog"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
      >
        <Palette size={15} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.theme.title}
            onClick={(e) => e.stopPropagation()}
            className="theme-sheet w-full max-w-md space-y-3 rounded-t-3xl border border-zinc-800 bg-zinc-900 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-3xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
                <Palette size={18} className="text-amber-400" />
                {t.theme.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.theme.close}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X size={18} />
              </button>
            </div>

            <div role="radiogroup" aria-label={t.theme.title} className="space-y-2">
              {THEMES.map((spec) => {
                const active = theme === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setTheme(spec.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-start ${
                      active ? 'border-amber-400 bg-amber-400/10' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <ThemePreview spec={spec} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-zinc-100">{t.theme.names[spec.id]}</span>
                      <span className="block text-xs text-zinc-400">{t.theme.blurbs[spec.id]}</span>
                    </span>
                    {active && <Check size={18} className="shrink-0 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
