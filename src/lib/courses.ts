import { getCollection, type CollectionEntry } from 'astro:content';

export type Course = CollectionEntry<'courses'>['data'];
export type Depth = 'core' | 'interview' | 'research';

export interface LessonRef {
  course: string;
  courseTitle: string;
  slug: string;
  number: string;
  title: string;
  depth: Depth;
  anim: boolean;
  moduleIndex: number;
  moduleTitle: string;
}

export const CATEGORIES: Record<Course['category'], string> = {
  math: 'Math',
  cs: 'Computer science',
  ml: 'Machine learning',
  data: 'Data',
  systems: 'Systems',
  research: 'Research',
  career: 'Career',
  tools: 'Tools',
};

export const PATHS = [
  {
    slug: 'ml-engineer',
    title: 'ML engineer (FAANG)',
    blurb: 'The route for applied ML roles: strong fundamentals, shipped models and both design rounds.',
    courses: ['python-for-ml', 'linear-algebra', 'probability-statistics', 'calculus-optimization', 'classical-ml', 'deep-learning', 'llms', 'mlops', 'ml-system-design', 'dsa', 'databases-sql', 'system-design', 'career-interviews'],
  },
  {
    slug: 'ml-research',
    title: 'ML research',
    blurb: 'Deeper maths, papers and reproductions, aimed at research internships or a master’s.',
    courses: ['linear-algebra', 'calculus-optimization', 'probability-statistics', 'information-theory', 'deep-learning', 'llms', 'research-skills', 'computer-vision', 'recommender-systems', 'reinforcement-learning'],
  },
  {
    slug: 'data-engineering',
    title: 'Data engineering',
    blurb: 'Pipelines, warehouses and streaming: the systems ML runs on.',
    courses: ['python-for-ml', 'databases-sql', 'data-engineering', 'system-design', 'mlops'],
  },
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Every lesson in a course with a stable slug and "1.2"-style number. */
export function lessonsOf(course: Course): LessonRef[] {
  const seen = new Set<string>();
  const out: LessonRef[] = [];
  course.modules.forEach((m, mi) => {
    m.lessons.forEach((l, li) => {
      let slug = slugify(l.t) || `lesson-${mi + 1}-${li + 1}`;
      if (seen.has(slug)) slug = `${slug}-${mi + 1}-${li + 1}`;
      seen.add(slug);
      out.push({
        course: course.slug,
        courseTitle: course.title,
        slug,
        number: `${mi + 1}.${li + 1}`,
        title: l.t,
        depth: l.d,
        anim: !!l.anim,
        moduleIndex: mi,
        moduleTitle: m.title,
      });
    });
  });
  return out;
}

const ORDER = PATHS[0].courses.concat(PATHS[1].courses, PATHS[2].courses, ['manim-explainers']);

export async function allCourses(): Promise<Course[]> {
  const entries = await getCollection('courses');
  const list = entries.map((e) => e.data);
  const rank = (s: string) => {
    const i = ORDER.indexOf(s);
    return i === -1 ? 999 : i;
  };
  return list.sort((a, b) => rank(a.slug) - rank(b.slug));
}

export function lessonCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.lessons.length, 0);
}

export function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
