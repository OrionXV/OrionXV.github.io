---
title: Research
permalink: /research/
description: "Research in sequential decision-making, causality, and agentic systems."
---

{% include research-areas.html %}

## Preprints

{% assign preprints = site.portfolio | where: "preprint", true | sort: 'order' %}
{% for project in preprints %}
{% include project-row.html %}
{% endfor %}

## Current work

### Graph diffusion & molecule generation

With Prof. Jian Kang at MBZUAI, I work on graph diffusion models (molecular generation).

### Bayesian optimization

With Prof. Raúl Astudillo at MBZUAI, I work on Bayesian optimization and multi-objective black-box optimization.

### Causality

With Prof. Yan Gong, I work on causal discovery and representation learning.

## Earlier research

At Aalto University, I worked with Joongi Shin under the supervision of Antti Oulasvirta on generative UI and Bayesian optimization to model user preferences.

At GenBio AI, I worked on optimization skills and TTA strategies for Virtual Cell Harness and its agent workflows. [Experience →]({{ '/experience/' | relative_url }})

## Technical report

<div class="report-block">
  <h3>Interventional TGMM</h3>
  <p class="project-meta">Exploratory study · 2026</p>
  <p>Tested a learned mixture solver under changes to the data distribution on Wine, Iris, and Digits. This is a robustness study, with limitations documented alongside the report.</p>
  <p class="project-actions"><a href="https://github.com/OrionXV/interventional_tgmm/tree/main/paper">Report &amp; notes <span aria-hidden="true">↗</span></a><a href="https://github.com/OrionXV/interventional_tgmm">Code <span aria-hidden="true">↗</span></a></p>
</div>
