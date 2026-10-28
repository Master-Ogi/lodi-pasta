import { useEffect, useRef, useState, type FormEvent } from 'react';
import { KeyRound, Loader2, Send, Trash2 } from 'lucide-react';
import type { ChatMessage } from '../types';
import { useTranslation } from '../i18n';
import { analysisSummary, analyzeFlour, askGemini, geminiErrorText } from '../utils/gemini';
import { imageToJpeg } from '../utils/image';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage';
import CameraButton from './CameraButton';
import FlourAnalysisCard from './FlourAnalysisCard';

export default function ChefAssistant() {
  const { t } = useTranslation();
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
      const answer = await askGemini(apiKey, history, t.languageName);
      setMessages([...history, { role: 'model', text: answer }]);
    } catch (err) {
      setError(geminiErrorText(err, t));
    } finally {
      setLoading(false);
    }
  };

  const sendPhoto = async (file: File) => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const { base64, dataUrl } = await imageToJpeg(file);
      const history: ChatMessage[] = [...messages, { role: 'user', text: t.chef.photoSent, image: dataUrl }];
      setMessages(history);
      const flour = await analyzeFlour(apiKey, base64, t.languageName);
      setMessages([...history, { role: 'model', text: analysisSummary(flour), flour }]);
    } catch (err) {
      setError(geminiErrorText(err, t));
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <form onSubmit={saveKey} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-400">
          <KeyRound size={16} />
          {t.chef.connect}
        </h2>
        <p className="text-sm text-zinc-400">
          {t.chef.keyIntro}{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-emerald-400 underline">
            {t.chef.getKey}
          </a>
        </p>
        <input
          type="password"
          autoComplete="off"
          dir="ltr"
          value={keyDraft}
          onChange={(e) => setKeyDraft(e.target.value)}
          placeholder="AIza…"
          aria-label={t.chef.keyAria}
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button type="submit" className="w-full rounded-lg bg-amber-400 py-2.5 font-semibold text-zinc-950 hover:bg-amber-300">
          {t.chef.saveKey}
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>{t.chef.keySaved}</span>
        <button type="button" onClick={removeKey} className="flex items-center gap-1 hover:text-red-300">
          <Trash2 size={12} />
          {t.chef.removeKey}
        </button>
      </div>

      {messages.length === 0 && (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">{t.chef.intro}</p>
          {t.chef.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void send(s)}
              className="block w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-start text-sm text-zinc-300 hover:border-zinc-700"
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
            className={`rounded-2xl px-4 py-3 text-sm ${
              m.role === 'user' ? 'ms-8 bg-amber-400 text-zinc-950' : 'me-8 border border-zinc-800 bg-zinc-900 text-zinc-200'
            }`}
          >
            {m.image && <img src={m.image} alt="" className="mb-2 max-h-48 rounded-lg" />}
            {m.flour ? <FlourAnalysisCard analysis={m.flour} /> : <p className="select-text whitespace-pre-wrap">{m.text}</p>}
          </div>
        ))}
        {loading && (
          <div className="me-8 flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
            <Loader2 size={14} className="animate-spin" />
            {t.chef.thinking}
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
        <CameraButton label={t.pantry.camera} disabled={loading} onCapture={(f) => void sendPhoto(f)} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chef.placeholder}
          aria-label={t.chef.questionAria}
          className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label={t.chef.send}
          className="rounded-xl bg-amber-400 px-4 text-zinc-950 disabled:opacity-40"
        >
          <Send size={18} className="rtl:-scale-x-100" />
        </button>
      </form>
    </div>
  );
}
