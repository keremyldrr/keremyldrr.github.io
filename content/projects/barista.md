---
title: "BARISTA: A Multi-Task Egocentric Benchmark for Compositional Visual Understanding"
date: 2026-05-12T00:00:00+00:00
draft: false
author: "Kerem Yildirir"
tags:
  - Machine Learning
  - Computer Vision
image: /images/projects/barista.jpg
description: "A densely annotated egocentric benchmark of 185 real-world coffee-preparation videos for procedural video understanding"
badges:
  - "Computer Vision"
  - "VLMs"
  - "Benchmark"
links:
  - icon: fas fa-external-link-alt
    url: https://arxiv.org/abs/2605.12074
  - icon: fas fa-database
    url: https://huggingface.co/datasets/ramblr/BARISTA
toc:
---

Scene understanding is central to general physical intelligence, and video is a primary modality for capturing both state and temporal dynamics of a scene. Yet understanding physical processes remains difficult, as models must combine object localization, hand-object interactions, relational parsing, temporal reasoning, and step-level procedural inference. Existing benchmarks usually evaluate these capabilities separately, limiting diagnosis of why models fail on procedural tasks. We introduce BARISTA, a densely annotated egocentric dataset and benchmark of 185 real-world coffee-preparation videos covering fully automatic, portafilter-based, and capsule-based workflows. BARISTA provides verified per-frame scene graphs linking persistent object identities to masks, tracks, boxes, attributes, typed relations, hand-object interactions, activities, and process steps. From these graphs, we derive zero-shot language-based tasks spanning phrase grounding, hand-object interaction recognition, referring, activity recognition, relation extraction, and temporal visual question answering. Experiments reveal strong variation across task families and no consistently dominant model family, positioning BARISTA as a challenging diagnostic benchmark for procedural video understanding.

**Status:** In submission

**Link to paper:** [arXiv:2605.12074](https://arxiv.org/abs/2605.12074)

**Dataset:** [huggingface.co/datasets/ramblr/BARISTA](https://huggingface.co/datasets/ramblr/BARISTA)
