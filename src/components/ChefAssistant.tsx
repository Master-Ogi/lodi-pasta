import { useEffect, useRef, useState, type FormEvent } from 'react';
import { KeyRound, Loader2, Send, Trash2 } from 'lucide-react';
import type { ChatMessage } from '../types';
import { askGemini } from '../utils/gemini';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage';

const SUGGESTIONS = [
  'My dough formed a ball — what went wrong?',
  'How do I unclog a dried spaghetti disc?',
  'Best blend for kids’ fettuccine?',
];

export default function ChefAssistant() {
  const [apiKey, setApiKey] = useState(() => loadJSON<string>(STORAGE_KEYS.geminiKey, ''));
  const [keyDraft, setKeyDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading]);

  const saveKey = (e: FormEvent) => {
    e.preventDefault();
    const key = keyDraft.trim();
    if (!key) return;
    saveJSON(STORAGE_KEYS.geminiKey, key);
    setApiKey(key);
    setKeyDraft('');
  };

  const removeKey = () => {
    saveJSON(STORAGE_KEYS.geminiKey, null);
    setApiKey('');
  };

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    const history: ChatMessage[] = [...messages, { role: 'user', text: question }];
    setMessages(history);
    setInput('');
    setError(null);
    setLoading(true);
    try {
      const answer = await askGemini(apiKey, history);
      setMessages([...history, { role: 'model', text: answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <form onSubmit={saveKey} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-400">
          <KeyRound size={16} />
          Connect Chef Gemini
        </h2>
        <p className="text-sm text-zinc-400">
          Paste your Google AI Studio API key. It is stored only on this device and sent only to Google.{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 underline"
          >
            Get a key
          </a>
        </p>
        <input
          type="password"
          autoComplete="off"
          value={keyDraft}
          onChange={(e) => setKeyDraft(e.target.value)}
          placeholder="AIza…"
          aria-label="Google AI Studio API key"
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button type="submit" className="w-full rounded-lg bg-amber-400 py-2.5 font-semibold text-zinc-950 hover:bg-amber-300">
          Save key
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Key saved on this device</span>
        <button type="button" onClick={removeKey} className="flex items-center gap-1 hover:text-red-300">
          <Trash2 size={12} />
          Remove key
        </button>
      </div>

      {messages.length === 0 && (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">Ask about dough texture, discs, blends or sauces.</p>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void send(s)}
              className="block w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-300 hover:border-zinc-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
              m.role === 'user' ? 'ml-8 bg-amber-400 text-zinc-950' : 'mr-8 border border-zinc-800 bg-zinc-900 text-zinc-200'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="mr-8 flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
            <Loader2 size={14} className="animate-spin" />
            Chef is thinking…
          </div>
        )}
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="sticky bottom-20 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Chef Gemini…"
          aria-label="Your question"
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="rounded-xl bg-amber-400 px-4 text-zinc-950 disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
