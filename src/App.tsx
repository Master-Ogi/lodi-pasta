import { useEffect, useState } from 'react';
import { BookOpen, Calculator as CalculatorIcon, ChefHat } from 'lucide-react';
import Calculator from './components/Calculator';
import RecipeBook from './components/RecipeBook';
import ChefAssistant from './components/ChefAssistant';
import WakeLockToggle from './components/WakeLockToggle';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from './i18n';
import { DISCS } from './data/discs';
import { STORAGE_KEYS, loadJSON, saveJSON } from './utils/storage';
import type { Disc } from './types';
import pkg from '../package.json';

type Tab = 'calculator' | 'recipes' | 'chef';

const TABS: { id: Tab; icon: typeof BookOpen }[] = [
  { id: 'calculator', icon: CalculatorIcon },
  { id: 'recipes', icon: BookOpen },
  { id: 'chef', icon: ChefHat },
];

function loadDisc(): Disc {
  const saved = loadJSON<string>(STORAGE_KEYS.disc, '');
  return DISCS.find((d) => d === saved) ?? 'spaghetti';
}

export default function App() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('calculator');
  // Active disc is shared: chosen on the calculator, leads pairings in recipe cards.
  const [disc, setDisc] = useState<Disc>(loadDisc);

  useEffect(() => saveJSON(STORAGE_KEYS.disc, disc), [disc]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-24 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">Lodi Pasta</h1>
          <p className="text-sm text-zinc-500">{t.app.tagline}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <LanguageSelector />
          <WakeLockToggle />
        </div>
      </header>

      {/* All tabs stay mounted so in-progress batch state survives tab switches. */}
      <main className="flex-1">
        <div hidden={tab !== 'calculator'}>
          <Calculator disc={disc} onDiscChange={setDisc} />
        </div>
        <div hidden={tab !== 'recipes'}>
          <RecipeBook activeDisc={disc} />
        </div>
        <div hidden={tab !== 'chef'}>
          <ChefAssistant />
        </div>
      </main>

      <footer className="mt-6 text-center text-xs text-zinc-600" dir="ltr">
        v{pkg.version}
      </footer>

      <nav className="fixed inset-x-0 bottom-0 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-3">
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-xs ${
                tab === id ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={20} />
              {t.app.tabs[id]}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
