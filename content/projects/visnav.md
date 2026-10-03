---
title: "Indirect Visual Odometry With Optical Flow"
date: 2021-08-06T00:00:00+00:00
draft: false
github_link: "https://github.com/keremyldrr/visual_odometry_optical_flow"
author: "Kerem Yildirir"
tags:
  - Computer Vision
image: /images/projects/visnav.jpg
description: "Extended a Stereo camera Visual Odometry implementation with Optical Flow"
badges:
  - "Computer Vision"
  - "C++"
links:
  - icon: fab fa-github
    url: https://github.com/keremyldrr/visual_odometry_optical_flow
  - icon: fas fa-file-pdf
    url: /project/visnav/Visnav_slides.pdf
toc:
---

Extending a Stereo camera Visual Odometry implementation with Optical Flow per the paper by Usenko et al. Optical flow was used to track detected Keypoints through frames and again was used to carry them to the other camera to triangulate 3D points in the map.

- Initial implementation of a stereo Visual Odometry application from a provided template.
- Adopting an Optical Flow approach to track key points through frames.
- Using Optical Flow to move key points from one camera to the other.
- Using the key points matched from both cameras to triangulate 3D points for mapping.

<figure>
<img src="/images/projects/visnav/ofvo.gif" alt="drawing" width="600"/>
<figcaption>Project pipeline</figcaption>
</figure>
