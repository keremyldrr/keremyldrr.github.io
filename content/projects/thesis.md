---
title: "Probabilistic Object Detection and Reconstruction from a single RGB-D frame"
date: 2022-09-01T00:00:00+00:00
draft: false
author: "Kerem Yildirir"
tags:
  - Machine Learning
  - Computer Vision
image: /images/projects/thesis/featured.png
description: "Master's thesis at the Technical University of Munich"
badges:
  - "Machine Learning"
  - "Computer Vision"
links:
  - icon: fas fa-file-pdf
    url: /project/thesis/KeremYildirirThesis.pdf
toc:
---

Semantic scene understanding is crucial aspect of modern day robotic applications. With the recent advances in deep learning and the increased availability of large scale richly annotated datasets, popularity of 3D scene understanding tasks has increased rapidly. In this work, we present a probabilistic hybrid solution with point-based and volumetric components to jointly localize, classify and complete the object instances given a single RGB-D frame. Our reconstructions are not restricted by the camera field of view, and aims to complete the object geometry even outside the camera frustum where the input signal is significantly weaker compared to the rest of the scene. Our probabilistic detection approach aims to combat ambiguous scenarios where objects in the scene have weak representation, and multiple completions are plausible for an object. We show that instead of outputting directly regressed bounding boxes, learning a distribution of bounding boxes can help us generate alternative suggestions for every detection proposal, which improves both detection and completion performance when utilized.

<figure>
<img src="/images/projects/thesis/network.png" alt="Detection and completion pipeline from a single image" width="800"/>
<figcaption>Detection and completion pipeline from a single image</figcaption>
</figure>

After performing detection and learning the bounding box distributions, we can sample multiple completion options for objects, one example is the following.

<figure>
<img src="/images/projects/thesis/sampled_sic.png" alt="Multiple chair completions" width="500"/>
<figcaption>Multiple chair completions for the point cloud representation in the detected box.</figcaption>
</figure>

**Thesis:** [Download PDF](/project/thesis/KeremYildirirThesis.pdf)
