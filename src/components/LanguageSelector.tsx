import { LANGUAGES, useTranslation } from '../i18n';

export default function LanguageSelector() {
  const { lang, setLang, t } = useTranslation();

  return (
    <div role="radiogroup" aria-label={t.app.language} className="flex overflow-hidden rounded-full bg-zinc-800 text-xs font-semibold">
      {LANGUAGES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={lang === id}
          onClick={() => setLang(id)}
          className={`px-2.5 py-1.5 ${lang === id ? 'bg-amber-400 text-zinc-950' : 'text-zinc-300 hover:bg-zinc-700'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
