// Data access for the owner-only features. In `npm run dev` with ?demo in the URL,
// everything runs on in-memory sample data so the views can be designed without signing in.
// The demo branch is compiled out of production builds (import.meta.env.DEV is false there).
import { getOwner, mightBeSignedIn, supa, isoDay, addDays } from './supa';

export interface Progress {
  course: string;
  lesson: string;
  status: 'learning' | 'done';
  confidence: number | null;
  review_step: number;
  next_review_at: string | null;
  completed_at: string | null;
  updated_at: string;
}
export interface Journal {
  id?: number;
  day: string;
  minutes: number;
  note: string | null;
  course: string | null;
  lesson: string | null;
  created_at?: string;
}

export const DEMO = import.meta.env.DEV && new URLSearchParams(location.search).has('demo');

const demo = DEMO ? seed() : { progress: [] as Progress[], journal: [] as Journal[], notes: new Map<string, string>() };

function seed() {
  const la = ['vectors-and-norms-l1-l2-l', 'dot-product-and-cosine-similarity', 'span-linear-independence-and-basis', 'subspaces-and-the-four-fundamental-spaces', 'practice-a-tiny-embedding-search-in-numpy', 'matrix-vector-and-matrix-matrix-multiplication', 'rank-and-null-space', 'inverses-and-determinants-as-volume'];
  const now = new Date().toISOString();
  const progress: Progress[] = la.map((lesson, i) => ({
    course: 'linear-algebra', lesson, status: i < 6 ? 'done' : 'learning', confidence: [4, 3, 2, 5, 4, 2, 3, null][i] ?? null,
    review_step: i % 3, next_review_at: i < 6 ? addDays([-1, 0, 2, 5, 0, 9][i]) : null, completed_at: i < 6 ? now : null, updated_at: now,
  }));
  progress.push(
    { course: 'python-for-ml', lesson: 'broadcasting', status: 'done', confidence: 4, review_step: 1, next_review_at: addDays(0), completed_at: now, updated_at: now },
    { course: 'dsa', lesson: 'sliding-window', status: 'learning', confidence: 2, review_step: 0, next_review_at: null, completed_at: null, updated_at: now },
  );
  const journal: Journal[] = [];
  for (let i = 0; i < 7 * 52; i++) {
    const v = (i * 37 + (i % 7) * 11 + Math.floor(i / 7) * 5) % 10;
    if ((i < 150 && v < 4) || (i > 260 && v < 7)) continue;
    journal.push({ id: i, day: addDays(-i), minutes: [0, 0, 0, 0, 25, 40, 55, 75, 110, 150][v] || 30, note: i === 0 ? 'Finished rank and null space, started inverses' : i === 1 ? 'Animated the shear transformation. Eigenvectors make sense now.' : null, course: i < 3 ? 'linear-algebra' : null, lesson: null, created_at: now });
  }
  return { progress, journal, notes: new Map<string, string>([['linear-algebra/dot-product-and-cosine-similarity', 'Cosine ignores length. Remember the √d scaling in attention.']]) };
}

export async function isOwner(): Promise<boolean> {
  if (DEMO) return true;
  if (!mightBeSignedIn()) return false;
  return !!(await getOwner());
}

export async function listProgress(course?: string): Promise<Progress[]> {
  if (DEMO) return demo.progress.filter((p) => !course || p.course === course);
  let q = supa.from('lesson_progress').select('*').order('updated_at', { ascending: false });
  if (course) q = q.eq('course', course);
  const { data } = await q;
  return (data ?? []) as Progress[];
}

export async function saveProgress(row: Partial<Progress> & { course: string; lesson: string }): Promise<Progress | null> {
  const full = { ...row, updated_at: new Date().toISOString() };
  if (DEMO) {
    const i = demo.progress.findIndex((p) => p.course === row.course && p.lesson === row.lesson);
    const merged = { ...(demo.progress[i] ?? { status: 'learning', confidence: null, review_step: 0, next_review_at: null, completed_at: null }), ...full } as Progress;
    if (i === -1) demo.progress.unshift(merged); else demo.progress[i] = merged;
    return merged;
  }
  const { data, error } = await supa.from('lesson_progress').upsert(full, { onConflict: 'user_id,course,lesson' }).select().single();
  if (error) throw error;
  return data as Progress;
}

export async function clearProgress(course: string, lesson: string) {
  if (DEMO) { demo.progress = demo.progress.filter((p) => !(p.course === course && p.lesson === lesson)); return; }
  await supa.from('lesson_progress').delete().eq('course', course).eq('lesson', lesson);
}

export async function listJournal(sinceDays = 7 * 53): Promise<Journal[]> {
  const since = addDays(-sinceDays);
  if (DEMO) return demo.journal.filter((j) => j.day >= since);
  const { data } = await supa.from('journal_entries').select('*').gte('day', since).order('created_at', { ascending: false });
  return (data ?? []) as Journal[];
}

export async function addJournal(entry: { minutes: number; note?: string | null; course?: string | null; lesson?: string | null }) {
  const row = { day: isoDay(), minutes: entry.minutes, note: entry.note ?? null, course: entry.course ?? null, lesson: entry.lesson ?? null };
  if (DEMO) { demo.journal.unshift({ ...row, id: Date.now(), created_at: new Date().toISOString() }); return; }
  const { error } = await supa.from('journal_entries').insert(row);
  if (error) throw error;
}

export async function getNote(course: string, lesson: string): Promise<string> {
  if (DEMO) return demo.notes.get(`${course}/${lesson}`) ?? '';
  const { data } = await supa.from('lesson_notes').select('body').eq('course', course).eq('lesson', lesson).maybeSingle();
  return data?.body ?? '';
}

export async function saveNote(course: string, lesson: string, body: string) {
  if (DEMO) { demo.notes.set(`${course}/${lesson}`, body); return; }
  const { error } = await supa.from('lesson_notes').upsert({ course, lesson, body, updated_at: new Date().toISOString() }, { onConflict: 'user_id,course,lesson' });
  if (error) throw error;
}

export function fmtMinutes(m: number): string {
  const h = Math.floor(m / 60);
  return h ? `${h} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`;
}

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
