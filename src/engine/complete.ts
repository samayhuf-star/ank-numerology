// The Complete Report: one dense report built from the full chart (see dense.ts). Price shown in the app offers.
import { buildDense } from './dense.ts';
import type { Page } from './fullReport.ts';

export type Who = { name: string; day: number; month: number; year: number };
export const PRICE_FALLBACK = { IN: '₹499', world: '$9.99' } as const;

export function buildComplete(b: Who, now: Date): Page[] { return buildDense(b, now); }
