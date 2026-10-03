---
title: "One Table to Count Them All: Parallel Frequency Estimation on Single-Board Computers"
date: 2018-01-01T00:00:00+00:00
draft: false
author: "Kerem Yildirir"
tags:
  - High Performance Computing
image: /images/projects/sketch.jpg
description: "Parallel frequency estimation using sketches on single-board computers"
badges:
  - "High Performance Computing"
links:
  - icon: fas fa-external-link-alt
    url: https://arxiv.org/abs/1903.00729
toc:
---

Sketches are probabilistic data structures that can provide approximate results within mathematically proven error bounds while using orders of magnitude less memory than traditional approaches. They are tailored for streaming data analysis on architectures even with limited memory such as single-board computers that are widely exploited for IoT and edge computing. Since these devices offer multiple cores, with efficient parallel sketching schemes, they are able to manage high volumes of data streams. However, since their caches are relatively small, a careful parallelization is required. In this work, we focus on the frequency estimation problem and evaluate the performance of a high-end server, a 4-core Raspberry Pi and an 8-core Odroid. As a sketch, we employed the widely used Count-Min Sketch. To hash the stream in parallel and in a cache-friendly way, we applied a novel tabulation approach and rearranged the auxiliary tables into a single one. To parallelize the process with performance, we modified the workflow and applied a form of buffering between hash computations and sketch updates. Today, many single-board computers have heterogeneous processors in which slow and fast cores are equipped together. To utilize all these cores to their full potential, we proposed a dynamic load-balancing mechanism which significantly increased the performance of frequency estimation.

**Link to paper:** [arXiv:1903.00729](https://arxiv.org/abs/1903.00729)
