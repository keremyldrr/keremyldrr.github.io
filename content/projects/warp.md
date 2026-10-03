---
title: "3D Real-Time Instance Segmentation with LDLS-YOLACT"
date: 2020-12-01T00:00:00+00:00
draft: false
github_link: "https://github.com/keremyldrr/3D-Instance-Segmentation-with-LDLS-YOLACT"
author: "Kerem Yildirir"
tags:
  - Machine Learning
  - Computer Vision
image: /images/projects/warp.jpg
description: "3D object detection and tracking pipeline for autonomous driving with Python and ROS"
badges:
  - "Machine Learning"
  - "Computer Vision"
  - "Python"
  - "ROS"
links:
  - icon: fab fa-github
    url: https://github.com/keremyldrr/3D-Instance-Segmentation-with-LDLS-YOLACT
  - icon: fab fa-youtube
    url: https://www.youtube.com/watch?v=uLb_L60hxHc
  - icon: fas fa-file-pdf
    url: /project/warp/slides.pdf
toc:
---

In this project I've developed a 3D object detection and tracking pipeline for autonomous driving with Python and ROS without any labeled 3D data. Our hardware were only a Livox mid-100 lidar sensor and a RealSense camera. After calibrating the sensors, the pipeline is as follows:

- Get 2D instance segmentation of the current camera image using [YOLACT](https://arxiv.org/abs/1904.02689).
- Update the id numbers of the detected entitites using [SORT](https://arxiv.org/abs/1602.00763)
- Project the masks into 3D point cloud using [LDLS](https://arxiv.org/abs/1910.13955)
- Compute the 3D bounding boxes for the detected areas.

{{<youtube h26dd4iHiVg>}}

{{<youtube uLb_L60hxHc>}}

{{<youtube FFxR8pmEyY0>}}

Source code can be found [here](https://github.com/keremyldrr/3D-Instance-Segmentation-with-LDLS-YOLACT). For the implementation with ROS, please get in touch.
