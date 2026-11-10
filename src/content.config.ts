import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const resource = z.object({
  t: z.string(),
  type: z.string(),
  url: z.string().optional().default(''),
  free: z.boolean().optional(),
  via: z.string().optional(),
  note: z.string().optional(),
});

const practice = z.object({
  t: z.string(),
  url: z.string().optional().default(''),
});

const lesson = z.object({
  t: z.string(),
  d: z.enum(['core', 'interview', 'research']),
  anim: z.boolean().optional(),
});

const courses = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './content/courses' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    category: z.enum(['math', 'cs', 'ml', 'data', 'systems', 'research', 'career', 'tools']),
    hours: z.number(),
    prereqs: z.array(z.string()).default([]),
    paths: z.array(z.string()).default([]),
    summary: z.string(),
    outcomes: z.array(z.string()).default([]),
    course_resources: z.array(resource).default([]),
    modules: z.array(
      z.object({
        title: z.string(),
        lessons: z.array(lesson),
        resources: z.array(resource).default([]),
        practice: z.array(practice).default([]),
      }),
    ),
  }),
});

// Your own lesson notes: content/notes/<course>/<lesson-slug>.md
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/notes' }),
  schema: z.object({
    why: z.string().optional(),
    updated: z.coerce.date().optional(),
    selfCheck: z.array(z.string()).default([]),
  }),
});

// Blog posts: content/writing/<slug>.md
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['notes', 'video', 'project', 'retro']).default('notes'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { courses, notes, writing };
