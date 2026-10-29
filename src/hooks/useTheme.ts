import { useLayoutEffect, useState } from 'react';
import type { ThemeId } from '../types';
import { DEFAULT_THEME, THEMES } from '../data/themes';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage';

function initialTheme(): ThemeId {
  const saved = loadJSON<string>(STORAGE_KEYS.theme, '');
  return THEMES.find((th) => th.id === saved)?.id ?? DEFAULT_THEME;
}

/** Active theme — applied to `<html data-theme>` before paint and persisted. */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(initialTheme);

  useLayoutEffect(() => {
    const spec = THEMES.find((th) => th.id === theme) ?? THEMES[0];
    const root = document.documentElement;
    root.dataset.theme = spec.id;
    root.classList.toggle('dark', spec.dark);
    root.style.colorScheme = spec.dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', spec.bg);
    saveJSON(STORAGE_KEYS.theme, spec.id);
  }, [theme]);

  return { theme, setTheme };
}
