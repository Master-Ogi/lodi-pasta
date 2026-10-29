import type { ThemeId } from '../types';

/** Theme list + preview swatches. The live tokens are in index.css under `:root[data-theme]`. */
export interface ThemeSpec {
  id: ThemeId;
  dark: boolean;
  /** Preview colors for the selector — also feed `<meta name="theme-color">` (bg). */
  bg: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
}

export const DEFAULT_THEME: ThemeId = 'classic-dark';

export const THEMES: ThemeSpec[] = [
  { id: 'classic-dark', dark: true, bg: '#09090b', card: '#18181b', border: '#27272a', text: '#f4f4f5', muted: '#71717a', accent: '#fbbf24' },
  { id: 'bottega-carta', dark: false, bg: '#FAF6F0', card: '#FFFFFF', border: '#ECE4DA', text: '#231815', muted: '#8A7A6E', accent: '#C85A32' },
  { id: 'trattoria-quadri', dark: false, bg: '#F6EFE4', card: '#FFFDF9', border: '#EADFD0', text: '#2A1D1A', muted: '#8C7B6F', accent: '#9E2A2B' },
  { id: 'linear-obsidian', dark: true, bg: '#080808', card: '#0F0F0F', border: '#1F1F1F', text: '#F2F2F2', muted: '#7A7A7A', accent: '#FFD60A' },
  { id: 'cucina-mediterranea', dark: false, bg: '#EDF1EC', card: '#FDFDFB', border: '#DCE3DA', text: '#1F2A22', muted: '#6F7F71', accent: '#B85A3C' },
];
