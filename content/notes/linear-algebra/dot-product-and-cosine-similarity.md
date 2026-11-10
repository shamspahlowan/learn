---
why: Every embedding search, every attention score and every linear layer is a pile of dot products. Understanding this one operation explains a surprising amount of modern ML.
updated: 2026-11-11
selfCheck:
  - Two embeddings have a cosine similarity of 0. What does that tell you, and what doesn't it tell you?
  - Why can a long document and a short one still have a cosine similarity close to 1?
  - Write the dot product of a 3×1 and a 1×3 vector the other way round. What do you get, and why is it different?
---

## The algebra

For two vectors $a, b \in \mathbb{R}^n$, the dot product multiplies matching coordinates and adds them up:

$$
a \cdot b = \sum_{i=1}^{n} a_i b_i = a^\top b
$$

It takes two vectors and returns one number.

## The geometry

The same number has a geometric meaning. If $\theta$ is the angle between the vectors:

$$
a \cdot b = \lVert a \rVert \, \lVert b \rVert \cos \theta
$$

So the dot product is large when the vectors point the same way, zero when they're perpendicular, and negative when they point in opposite directions. It also grows with their lengths.

Another way to see it: $\frac{a \cdot b}{\lVert b \rVert}$ is the length of the **projection** of $a$ onto the direction of $b$, the shadow $a$ casts on $b$.

## Cosine similarity

Divide out both lengths and only direction is left:

$$
\cos \theta = \frac{a \cdot b}{\lVert a \rVert \, \lVert b \rVert} \in [-1, 1]
$$

That's cosine similarity. Two documents of very different lengths can still be about the same thing, and cosine similarity treats them that way.

## In NumPy

```python
import numpy as np

a = np.array([2.0, 1.0, 0.0])
b = np.array([1.0, 3.0, 1.0])

dot = a @ b                                   # 5.0
cos = dot / (np.linalg.norm(a) * np.linalg.norm(b))
print(round(cos, 3))                          # 0.674
```

The `@` here is the same operator a linear layer uses. Attention scores are also dot products, between queries and keys, divided by $\sqrt{d}$ so they don't grow with the dimension.

## Common mistakes

- **Comparing raw dot products between items of different lengths.** Normalise first if you only care about direction.
- **Reading 0 as "unrelated".** Orthogonal means no *linear* alignment in this space. It says nothing about other relationships.
