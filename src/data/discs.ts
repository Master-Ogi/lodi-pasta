import type { Disc } from '../types';

export const DISCS: Disc[] = ['spaghetti', 'fettuccine', 'penne', 'lasagna', 'angel-hair', 'thick-round'];

/** Boiling time range in minutes per disc */
export const BOIL_MINUTES: Record<Disc, [number, number]> = {
  'angel-hair': [3, 4],
  spaghetti: [5, 6],
  fettuccine: [5, 6],
  penne: [10, 12],
  'thick-round': [10, 12],
  lasagna: [3, 4],
};
