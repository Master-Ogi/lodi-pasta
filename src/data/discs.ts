import type { Disc } from '../types';

export const DISCS: Disc[] = ['spaghetti', 'fettuccine', 'penne', 'lasagna', 'angel-hair', 'thick-round'];

/** Boiling time range in minutes per disc — FRESH extruded pasta (dried pasta takes far longer) */
export const BOIL_MINUTES: Record<Disc, [number, number]> = {
  'angel-hair': [1.5, 2.5],
  spaghetti: [2, 3],
  fettuccine: [3, 4],
  penne: [4, 5],
  'thick-round': [4, 5],
  lasagna: [2, 3],
};
