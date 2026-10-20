---
title: "High-Dimensional Multi-Objective Black-Box Optimization via Diffusion Posterior Sampling"
order: 23
featured: true
group: "research"
metadata: "Preprint · May 2026"
authors: "Felix Huber, <strong>Syed Arsalaan Nadim</strong>, Jian Kang, Raul Astudillo"
summary: "Posterior inference is a promising route to high-dimensional black-box optimization, but one posterior cannot cover a whole Pareto set when objectives compete. We treat a randomized augmented Chebyshev scalarization as a latent preference, so the marginal posterior is a mixture over trade-off-specific Boltzmann posteriors. An elite-pooling step gathers top designs across many scalarizations and trains one diffusion prior on them, giving a multimodal prior aligned with Pareto-relevant regions. The method avoids acquisition optimization, keeps diversity across trade-offs, and performs strongly on several challenging test problems."
---

Posterior inference is a promising route to high-dimensional black-box optimization, but one posterior cannot cover a whole Pareto set when objectives compete. We treat a randomized augmented Chebyshev scalarization as a latent preference, so the marginal posterior is a mixture over trade-off-specific Boltzmann posteriors. An elite-pooling step gathers top designs across many scalarizations and trains one diffusion prior on them, giving a multimodal prior aligned with Pareto-relevant regions. The method avoids acquisition optimization, keeps diversity across trade-offs, and performs strongly on several challenging test problems.
