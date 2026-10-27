import { useState } from 'react';
import { BookOpen, Calculator as CalculatorIcon, ChefHat } from 'lucide-react';
import Calculator from './components/Calculator';
import RecipeBook from './components/RecipeBook';
import ChefAssistant from './components/ChefAssistant';
import WakeLockToggle from './components/WakeLockToggle';
import pkg from '../package.json';

type Tab = 'calculator' | 'recipes' | 'chef';

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: 'calculator', label: 'Calculator', icon: CalculatorIcon },
  { id: 'recipes', label: 'Recipes', icon: BookOpen },
  { id: 'chef', label: 'Ask Chef Gemini', icon: ChefHat },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('calculator');

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-24 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">Lodi Pasta</h1>
          <p className="text-sm text-zinc-500">Philips 7000 companion</p>
        </div>
        <WakeLockToggle />
      </header>

      {/* All tabs stay mounted so in-progress batch state survives tab switches. */}
      <main className="flex-1">
        <div hidden={tab !== 'calculator'}>
          <Calculator />
        </div>
        <div hidden={tab !== 'recipes'}>
          <RecipeBook />
        </div>
        <div hidden={tab !== 'chef'}>
          <ChefAssistant />
        </div>
      </main>

      <footer className="mt-6 text-center text-xs text-zinc-600">v{pkg.version}</footer>

      <nav className="fixed inset-x-0 bottom-0 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-3">
          {TABS.map(({ id, label, icon: Icon }) => (
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
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
