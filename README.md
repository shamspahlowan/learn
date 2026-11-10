# Shams learns

A course-style learning hub for machine learning engineering: 20 courses, 344 lessons, notes with maths, a blog, and a private progress tracker.

Live at **https://shamspahlowan.github.io/learn/**

## How it's organised

| Folder | What lives there |
|---|---|
| `content/courses/*.yaml` | One file per course: modules, lessons (with depth tags), resources and practice |
| `content/notes/<course>/<lesson>.md` | Your notes for a lesson. Maths with `$...$` and `$$...$$` |
| `content/writing/*.md` | Blog posts |
| `src/` | The Astro site |

Lesson URLs come from the lesson title, for example `linear-algebra/dot-product-and-cosine-similarity`. The empty state on each lesson page shows the exact path to create.

### Writing a lesson note

```markdown
---
why: One or two lines on why this matters in ML.
updated: 2026-11-12
selfCheck:
  - A question you should answer out loud before marking the lesson done
---

## The idea

Text, $\LaTeX$, code blocks, images.
```

### Writing a post

```markdown
---
title: What SVD actually does
description: One sentence for lists and RSS.
date: 2026-11-20
kind: notes   # notes | video | project | retro
tags: [linear-algebra]
---
```

For a video, embed a YouTube iframe or put a small `.mp4` in `public/videos/` and use `<video src="/learn/videos/clip.mp4" controls muted loop playsinline></video>`.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321/learn/
npm run build      # builds and indexes search into dist/
```

Pushing to `main` deploys to GitHub Pages automatically.

## The private tracker

`/learn/tracker/` and the "Your progress" panel on lesson pages only work for the owner. They use Supabase project `learn-tracker`:

- The **first** account that signs in becomes the owner, and that can never change.
- Every table has row-level security tied to the owner's account, so the public key in `src/lib/site.ts` can't read or write anything for anyone else.
- A GitHub Action pings the database twice a week so the free project doesn't pause.

### One-time setup (about 5 minutes)

1. **Create a GitHub OAuth app** at <https://github.com/settings/developers> → *New OAuth App*:
   - Homepage URL: `https://shamspahlowan.github.io/learn/`
   - Authorization callback URL: `https://xzlcubaehmbboraafype.supabase.co/auth/v1/callback`
2. In the **Supabase dashboard** → *Authentication* → *Sign In / Providers* → **GitHub**: turn it on and paste the Client ID and Client Secret.
3. In *Authentication* → *URL Configuration*:
   - Site URL: `https://shamspahlowan.github.io/learn/`
   - Redirect URLs: add `https://shamspahlowan.github.io/learn/tracker/` and `http://localhost:4321/learn/tracker/`
4. Open `/learn/tracker/` and sign in with GitHub. You're now the owner.
5. Back in Supabase → *Authentication* → *Sign In / Providers*: turn off **Allow new users to sign up**.
