import Calculator from './components/Calculator';
import pkg from '../package.json';

export default function App() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-amber-400">Lodi Pasta</h1>
        <p className="text-sm text-zinc-500">Philips 7000 companion</p>
      </header>
      <main className="flex-1">
        <Calculator />
      </main>
      <footer className="mt-6 text-center text-xs text-zinc-600">v{pkg.version}</footer>
    </div>
  );
}
