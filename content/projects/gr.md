---
title: "Monte Carlo Dropout for Object Detection on Point Clouds"
date: 2022-01-01T00:00:00+00:00
draft: false
github_link: "https://github.com/keremyldrr/votenet_with_mc_dropout"
author: "Kerem Yildirir"
tags:
  - Machine Learning
  - Computer Vision
image: /images/projects/gr.jpg
description: "Extended VoteNet for computing epistemic uncertainty with Monte Carlo dropout"
badges:
  - "Machine Learning"
  - "Computer Vision"
links:
  - icon: fab fa-github
    url: https://github.com/keremyldrr/votenet_with_mc_dropout
  - icon: fas fa-file-pdf
    url: /project/gr/slides.pdf
toc:
---

In this work, we take VoteNet, a state-of-the-art deep neural network for object detection, as a basis and extend it for computing epistemic uncertainty in its predictions with Monte Carlo dropout. We show that this quantity can be used as a weighting factor for predictions, leading to an increase in the overall performance of the model, and also as a metric for selecting the most beneficial scenes to annotate for training from unknown data for active learning scenarios.

<figure>
<img src="/images/projects/gr/gr.gif" alt="Computation of uncertainty" width="600"/>
<figcaption>Computation of uncertainty</figcaption>
</figure>
