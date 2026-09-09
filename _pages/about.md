---
title: About
permalink: /
description: "Syed Arsalaan Nadim. MSc student at MBZUAI working on graph diffusion models, molecule generation, and Bayesian optimization."
---

<p class="eyebrow">Statistics &amp; Data Science · MBZUAI</p>

<p class="intro">I’m Arsalaan, an MSc student at MBZUAI. I work on sequential decision-making, causality, and agentic systems.</p>

With Prof. Jian Kang, I work on **graph diffusion models and molecule generation**. With Prof. Raúl Astudillo, I work on **Bayesian optimization and multi-objective black-box optimization**.

I was a Research Engineer Intern at GenBio AI and a Research Assistant at Aalto University. Before MBZUAI, I worked in Technical Support & Research at ONGC Videsh. I studied Petroleum Engineering at IIT (ISM) Dhanbad.

## Research areas

{% include research-areas.html %}

<p class="section-link"><a href="{{ '/research/' | relative_url }}">Research and technical report <span aria-hidden="true">→</span></a></p>

<h2 id="projects">Selected projects</h2>

{% assign selected = site.portfolio | sort: 'order' %}
{% for project in selected limit:4 %}
{% include project-row.html %}
{% endfor %}

<p class="section-link"><a href="{{ '/projects/' | relative_url }}">All {{ site.portfolio.size }} projects <span aria-hidden="true">→</span></a></p>

## Elsewhere

I enjoy reading and creative writing. I previously served as Editor-in-Chief for the SPE IIT(ISM) student chapter and on my school’s editorial board.
