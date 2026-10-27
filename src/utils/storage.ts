// localStorage can throw (private mode, blocked storage) — never let that break the app.

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — settings simply won't persist.
  }
}

export const STORAGE_KEYS = {
  calculator: 'lodi.calculator',
  geminiKey: 'lodi.geminiKey',
  lang: 'lodi.lang',
  disc: 'lodi.disc',
  pantry: 'lodi.pantry',
  colors: 'lodi.colors',
} as const;
