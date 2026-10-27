import type { ChatMessage, FlourAnalysis } from '../types';
import type { Dictionary } from '../i18n/types';
import { HYDRATION_MAX, HYDRATION_MIN, clamp } from './math';

export const GEMINI_MODEL = 'gemini-3.8-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export class GeminiError extends Error {
  readonly code: 'empty' | 'invalid' | 'http';
  readonly detail: string;
  constructor(code: 'empty' | 'invalid' | 'http', detail = '') {
    super(detail || code);
    this.code = code;
    this.detail = detail;
  }
}

/** Localized message for any error thrown by this module (or the network). */
export function geminiErrorText(err: unknown, t: Dictionary): string {
  if (err instanceof GeminiError) {
    if (err.code === 'http') return t.chef.errors.http(err.detail);
    return t.chef.errors[err.code];
  }
  return t.chef.errors.generic;
}

export function chefSystemPrompt(languageName: string): string {
  return `You are Chef Gemini, a concise kitchen assistant inside the Lodi Pasta app for the Philips 7000 Series Pasta Maker. Always reply in ${languageName}. Answer in short, practical steps using metric units.

Machine mechanics you must respect:
- Flour batches snap to 50g steps between 200g and 600g (auger pressure needs a discrete batch). Never suggest odd weights like 371g.
- Portions: adult 120g flour, child 70g flour, rounded up to the next 50g batch.
- Liquid = flour × hydration. Default hydration is 38.0% (the "Golden Spot"); allowed range 36.5–39.5%. Example: 400g flour → 152g liquid.
- Scale flow: tare the vessel, crack eggs in, weigh, then top up with water to the liquid target. Squid ink and spinach juice count as liquid.
- Correct dough after mixing is crumbly, pea-sized, and presses together when squeezed — it should NOT form a ball. A ball means too wet.
- Pour the egg/water mix slowly over 15–20 seconds across all lid slits while the auger turns.
- Recycle the first 3–5 cm of extruded pasta back into the chamber through the lid slots for even density.
- Default blend: 80% Semola Rimacinata (Yellow, durum — structure and bite) / 20% Tipo 00 (Red, soft wheat — smoothness). Red above 70% risks gummy extrusion; 100% Yellow without egg risks brittle extrusion.
- Boiling times for fresh extruded pasta: angel hair 3–4 min, spaghetti/fettuccine 5–6 min, penne/thick round 10–12 min, lasagna sheets 3–4 min (or par-boil 2 min before baking).

Disc care:
- Never let disc holes dry with dough in them between batches; submerge the disc and front sleeve in water.
- For a dried, clogged disc: freeze it for ~2 hours, then push the frozen dough out with the cleaning tool. Never force holes with sharp metal.

Culinary protocols:
- Sauté tomato paste in fat 2–3 minutes until bright red turns dark brick-orange before adding liquid.
- Add fine Parmesan off the heat and emulsify with starchy pasta water.
- Flash-freeze pasta nests on parchment 45–60 minutes until rock solid before vacuum sealing (gentle mode); cook from frozen.`;
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
}

async function callGemini(apiKey: string, body: object): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as GeminiResponse;
  if (!res.ok) throw new GeminiError('http', data.error?.message ?? String(res.status));

  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim();
  if (!text) throw new GeminiError('empty');
  return text;
}

export function askGemini(apiKey: string, history: ChatMessage[], languageName: string): Promise<string> {
  return callGemini(apiKey, {
    systemInstruction: { parts: [{ text: chefSystemPrompt(languageName) }] },
    contents: history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
  });
}

const FLOUR_SCHEMA = {
  type: 'OBJECT',
  properties: {
    name: { type: 'STRING' },
    grade: { type: 'STRING' },
    wheat: { type: 'STRING', enum: ['durum', 'soft'] },
    proteinPct: { type: 'NUMBER', nullable: true },
    strengthW: { type: 'NUMBER', nullable: true },
    hydrationPct: { type: 'NUMBER' },
    pairing: { type: 'STRING' },
  },
  required: ['name', 'grade', 'wheat', 'proteinPct', 'strengthW', 'hydrationPct', 'pairing'],
};

const isNumOrNull = (v: unknown): v is number | null => v === null || (typeof v === 'number' && Number.isFinite(v));

function isFlourAnalysis(v: unknown): v is FlourAnalysis {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.name === 'string' &&
    typeof o.grade === 'string' &&
    (o.wheat === 'durum' || o.wheat === 'soft') &&
    isNumOrNull(o.proteinPct) &&
    isNumOrNull(o.strengthW) &&
    typeof o.hydrationPct === 'number' &&
    typeof o.pairing === 'string'
  );
}

/** Read a flour bag / nutrition label photo and return a structured profile. */
export async function analyzeFlour(apiKey: string, jpegBase64: string, languageName: string): Promise<FlourAnalysis> {
  const prompt = `Read this photo of a flour bag or nutrition label for use in a Philips 7000 extrusion pasta maker.
Return: name (brand + product), grade (e.g. "Tipo 00", "Semola rimacinata"), wheat ("durum" for durum/semola, otherwise "soft"),
proteinPct (grams of protein per 100 g, or null if not visible), strengthW (the W value, or null if not printed),
hydrationPct (recommended egg+water hydration for this flour, between 36.5 and 39.5),
pairing (one or two sentences in ${languageName}: how to blend it — Yellow durum semola gives structure, Red Tipo 00 gives softness; default blend 80/20).`;

  const text = await callGemini(apiKey, {
    contents: [{ role: 'user', parts: [{ inlineData: { mimeType: 'image/jpeg', data: jpegBase64 } }, { text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: FLOUR_SCHEMA },
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new GeminiError('invalid');
  }
  if (!isFlourAnalysis(parsed)) throw new GeminiError('invalid');
  return {
    ...parsed,
    hydrationPct: Math.round(clamp(parsed.hydrationPct, HYDRATION_MIN * 100, HYDRATION_MAX * 100) * 2) / 2,
  };
}

/** Compact text form of an analysis, kept in chat history so follow-up questions have context. */
export function analysisSummary(a: FlourAnalysis): string {
  return `Flour label scan: ${a.name} (${a.grade}), ${a.wheat} wheat, protein ${a.proteinPct ?? 'n/a'}%, W ${a.strengthW ?? 'n/a'}, recommended hydration ${a.hydrationPct}%. ${a.pairing}`;
}
