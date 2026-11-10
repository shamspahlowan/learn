# Learning hub content

One YAML file per course in `courses/`. The site reads these files to build the course pages, syllabus rows and resource lists. Your own lesson notes will later live in `notes/<course>/<lesson>.md`.

## Course file shape

```yaml
slug: linear-algebra            # URL: /learn/courses/linear-algebra
title: Linear algebra for machine learning
category: math                  # math | cs | ml | data | systems | research | career | tools
hours: 38                       # rough estimate
prereqs: []                     # other course slugs
paths: [ml-engineer, ml-research]
outcomes: [...]                 # "By the end you can" list
modules:
  - title: Vectors and spaces
    lessons:
      - {t: Dot product and cosine similarity, d: interview, anim: true}
    resources:
      - {t: "...", type: video, url: "...", free: true, via: community}
    practice:
      - {t: "...", url: "..."}
```

| Field | Meaning |
|---|---|
| `d` | depth: `core` (must do), `interview` (must explain or derive), `research` (proofs and papers) |
| `anim: true` | a good candidate for a Manim animation or an interactive widget |
| `type` | `video`, `course`, `book`, `docs`, `article`, `paper`, `repo`, `exercises`, `tool` |
| `free` | `false` means paid or partly paid |
| `via` | `official` (authors or maintainers), `community` (recommended on Reddit, Hacker News or GitHub lists) |

## Paths

| Slug | Courses, in order |
|---|---|
| `ml-engineer` | python-for-ml → linear-algebra → probability-statistics → calculus-optimization → classical-ml → deep-learning → llms → mlops → ml-system-design, with dsa, databases-sql and system-design alongside |
| `ml-research` | linear-algebra → calculus-optimization → probability-statistics → information-theory → deep-learning → llms → research-skills, plus one of computer-vision, recommender-systems or reinforcement-learning |
| `data-engineering` | python-for-ml → databases-sql → data-engineering → system-design → mlops |

## Cross-course exercise platforms

| Platform | Good for |
|---|---|
| [Deep-ML](https://www.deep-ml.com/) | LeetCode-style ML problems in the browser, from linear algebra to transformers |
| [numpy-100](https://github.com/rougier/numpy-100) | 100 NumPy exercises with hints and solutions |
| [Tensor Puzzles](https://github.com/srush/Tensor-Puzzles) | broadcasting-only tensor puzzles, great before ML coding interviews |
| [GPU Puzzles](https://github.com/srush/GPU-Puzzles) | learn CUDA thinking through puzzles |
| [Kaggle Learn](https://www.kaggle.com/learn) and [competitions](https://www.kaggle.com/competitions) | short courses and real datasets |
| [NeetCode 150](https://neetcode.io/roadmap) | the DSA backbone |
| [LeetCode SQL 50](https://leetcode.com/studyplan/top-sql-50/) | SQL interview practice |

Last researched: 11 Nov 2026. Links were checked against search results on that date. Re-check paid or fast-moving resources (especially LLM ones) every few months.
