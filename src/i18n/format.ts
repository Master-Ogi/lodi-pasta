/** Locale-aware number: up to 2 decimals, or exactly `digits` when given. */
export function formatNum(n: number, locale: string, digits?: number): string {
  return n.toLocaleString(
    locale,
    digits === undefined
      ? { maximumFractionDigits: 2 }
      : { minimumFractionDigits: digits, maximumFractionDigits: digits },
  );
}

/** Polish plural forms: 1 → one, 2–4 (not 12–14) → few, else many. Fractions take "few". */
export function plPlural(q: number, one: string, few: string, many: string): string {
  if (!Number.isInteger(q)) return few;
  if (q === 1) return one;
  const last = q % 10;
  const lastTwo = q % 100;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many;
}

const FRACTION_GLYPHS: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾' };

/** Kitchen measure with fraction glyphs: 0.5 → "½", 1.25 → "1¼". Other values fall back to formatNum. */
export function formatFraction(q: number, locale: string): string {
  const whole = Math.floor(q);
  const glyph = FRACTION_GLYPHS[String(Math.round((q - whole) * 100) / 100)];
  if (glyph === undefined) return formatNum(q, locale);
  return whole > 0 ? `${formatNum(whole, locale)}${glyph}` : glyph;
}
