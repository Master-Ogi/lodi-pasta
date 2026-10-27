import { Sun, SunDim } from 'lucide-react';
import { useWakeLock } from '../hooks/useWakeLock';

export default function WakeLockToggle() {
  const { supported, active, toggle } = useWakeLock();
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? 'bg-emerald-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
      }`}
    >
      {active ? <Sun size={14} /> : <SunDim size={14} />}
      {active ? 'Screen awake' : 'Keep screen awake'}
    </button>
  );
}
