import { createClient, type Session } from '@supabase/supabase-js';
import { SUPABASE } from '../lib/site';

export const supa = createClient(SUPABASE.url, SUPABASE.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export interface Owner { session: Session; userId: string }

let ownerPromise: Promise<Owner | null> | null = null;

/** Resolves to the signed-in owner, or null for everyone else. Visitors never hit the network. */
export function getOwner(): Promise<Owner | null> {
  if (ownerPromise) return ownerPromise;
  ownerPromise = (async () => {
    const { data } = await supa.auth.getSession();
    const session = data.session;
    if (!session) return null;
    const { data: row } = await supa.from('app_owner').select('user_id').eq('user_id', session.user.id).maybeSingle();
    return row ? { session, userId: session.user.id } : null;
  })().catch(() => null);
  return ownerPromise;
}

/** Only touch Supabase when a session might exist, so plain visitors load nothing extra. */
export function mightBeSignedIn(): boolean {
  try {
    return Object.keys(localStorage).some((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
  } catch {
    return false;
  }
}

export const REVIEW_STEPS = [1, 3, 7, 21, 60];

export function isoDay(d = new Date()): string {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
}

export function addDays(days: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return isoDay(d);
}
