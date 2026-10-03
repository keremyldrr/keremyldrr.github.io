---
title: "Plant Identification with Deep Learning Ensembles"
date: 2018-01-01T00:00:00+00:00
draft: false
author: "Kerem Yildirir"
tags:
  - Machine Learning
  - Computer Vision
image: /images/projects/lifeclef.jpg
description: "Plant identification with deep learning ensembles, published at ExpertLifeCLEF 2018"
badges:
  - "Machine Learning"
  - "Computer Vision"
links:
  - icon: fas fa-file-pdf
    url: http://ceur-ws.org/Vol-2125/paper_176.pdf
toc:
---

This work describes the plant identification system that we submitted to the ExpertLifeCLEF plant identification campaign in 2018. We fine-tuned two pre-trained deep learning architectures (SeNet and DensNetwork) using images shared by the CLEF organizers in 2017. Our main runs are 4 ensembles obtained with different weighted combinations of the 4 deep learning architectures. The fifth ensemble is based on deep learning features but uses Error Correcting Output Codes (ECOC) as the ensemble. Our best system has achieved a classification accuracy of 74.4%, while the best system obtained 86.7% accuracy, on the whole of the official test data. This system ranked 4th place among all the teams, but matched the accuracy of one of the human experts.

<figure>
<img src="/images/projects/lifeclef.jpg" alt="The official released results of ExpertLifeCLEF 2018" width="700"/>
<figcaption>The official released results of ExpertLifeCLEF 2018</figcaption>
</figure>

**Published at:** ExpertLifeCLEF 2018

**Link to paper:** [CEUR-WS Vol-2125](http://ceur-ws.org/Vol-2125/paper_176.pdf)
