---
title: "From Research to Production I: Efficient Model Deployment with Triton Inference Server"
date: 2023-10-07
draft: false
tags:
  - "machine-learning"
  - "triton"
  - "model-deployment"
image: https://developer.nvidia.com/sites/default/files/akamai/triton.png
description: "A practical guide to deploying ML models with NVIDIA Triton Inference Server — from saving a pretrained model to running inference via gRPC."
---

With the recent developments in the field of artificial intelligence, a lot of new use cases are emerging. Developing the model is a big challenge itself, but many other challenges present themselves when we want to turn this model into a product. The workflow of a machine learning application typically consists of 3 stages:

- Exploration and data processing
- Modeling
- Deployment

![ML Workflow](https://developer-blogs.nvidia.com/wp-content/uploads/2023/02/ml-workflow-udacity.png)
*The machine learning workflow (Source: Become a Machine Learning Engineer Nanodegree (Udacity))*

First stage focuses on retrieving and processing high quality data, which is essential for a succesful model. Second stage is where the model is developed, trained and validated. The final stage is when the model has passed the necessary checks and benchmarks and is ready to be served for production.

There are many tools for serving models, such as [TorchServe](https://pytorch.org/serve/index.html) and [Tensorflow Serve](https://www.tensorflow.org/tfx/guide/serving) engines from PyTorch and Tensorflow. [BentoML](https://bentoml.com/) offers a complete suite for training and deploying ML applications.

NVIDIA Triton Inference Server, or Triton, is an open-source software that addresses the deployment stage. It does NOT offer any functionality regarding the first two stages, but it stands out with its comprehensive documentation, flexibility and hardware optimization options.

It offers support for most machine learning (ML) frameworks as well as custom C++ and Python backends. This reduces the need for multiple inference servers for different frameworks, allowing you to simplify your machine learning infrastructure. It seamlessly works with NVIDIA GPUs and allow simultaneous model execution on multiple GPUs, increasing hardware utilization.

![Triton Architecture](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/_images/arch.jpg)
*Triton Inference Server workflow*

By default, Triton does not offer any autoscaling, although it can be achieved by configuring Kubernetes, or using NVIDIA's native tool, Triton Management Service (TMS).

[TMS](https://developer.nvidia.com/blog/scaling-deep-learning-deployments-with-nvidia-triton-management-service) enables the automated deployment of multiple Triton Inference Server instances in Kubernetes. It provides resource-efficient model orchestration on GPUs and CPUs, simplifying the scaling and management of AI models in production environments.

## Getting Started

In this article we will demonstrate a simple scenario where we have a classification model, and we want to deploy it to production with Triton. This is the first installment of a series where we gradually build up to a solution for image classification from a simple script to a FastAPI application that runs on cloud. For simplicity, we will not use any GPUs and go through the workflow on a local machine without any GPU. If you wish to run this on GPU, then simply add `--gpus all` flag to the `docker` command below.

We will first pull the pretrained ResNet50 model, then save it as Tensorflow SavedModel object. For other model frameworks, check [here](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_repository.html). After saving the model weights, we will create a model repository for the Triton Server, and run the server using `docker`. When the server is up and running, we will write a simple client script to act as our deployed application and communicate with the server and send inference requests.

## Creating a model

With the following script, we create the model artifacts and save it locally. This can also be hosted in any cloud storage, such as Azure Blob Storage or Amazon S3 buckets.

```python
import tensorflow as tf
from tensorflow.keras.applications import ResNet50

# Step 1: Load the pretrained model
model = ResNet50(weights='imagenet')

# Step 2: Save the model in SavedModel format
saved_model_path = 'saved_model_directory'
tf.saved_model.save(model, saved_model_path)
```

## Deploying the model with Triton

In order to deploy a model with Triton, we need to create a `model_repository` put the saved weights in it with the desired directory structure. It looks like the following for the general case:

```
<model-repository-path>/
    <model-name>/
      [config.pbtxt]
      [<output-labels-file> ...]
      <version>/
        <model-definition-directory>
      <version>/
        <model-definition-directory>
      ...
    <model-name>/
      [config.pbtxt]
      [<output-labels-file> ...]
      <version>/
        <model-definition-directory>
      <version>/
        <model-definition-directory>
      ...
    ...
```

and like this for this case:

```
model_repository
└── resnet50
    ├── 1
    │   └── model.savedmodel
    │       ├── assets
    │       ├── fingerprint.pb
    │       ├── saved_model.pb
    │       └── variables
    │           ├── variables.data-00000-of-00001
    │           └── variables.index
    └── config.pbtxt
```

Each model needs to be given a name, a model config named `config.pbtxt` and at least one version folder (as an integer), and the model definition file, which corresponds to the model weights file. Model definition file should be named after the type of model, `model.savedmodel` in this case.

In order to achieve this, we need to create the structure and copy the model files under `saved_model_directory` to the `model_repository/resnet50/1/model.savedmodel/` and create a `model_repository/resnet50/config.pbtxt` with the following content:

```
name: "resnet50"
platform: "tensorflow_savedmodel"
```

`name` and `platform` are required parameters for Triton to identify and address the model and no further arguments needed to get started as Triton auto completes the model information from the model definition, and uses default options for the other configurations. The complete model configuration can be queried from Triton Inference Server and looks like the following:

```json
{
  "name": "resnet50",
  "platform": "tensorflow_savedmodel",
  "backend": "tensorflow",
  "version_policy": {
    "latest": {
      "num_versions": 1
    }
  },
  "max_batch_size": 4,
  "input": [
    {
      "name": "input_1",
      "data_type": "TYPE_FP32",
      "format": "FORMAT_NONE",
      "dims": [224, 224, 3],
      "is_shape_tensor": false,
      "allow_ragged_batch": false,
      "optional": false
    }
  ],
  "output": [
    {
      "name": "predictions",
      "data_type": "TYPE_FP32",
      "dims": [1000],
      "label_filename": "",
      "is_shape_tensor": false
    }
  ],
  "dynamic_batching": {
    "preferred_batch_size": [4],
    "max_queue_delay_microseconds": 0,
    "preserve_ordering": false,
    "priority_levels": 0,
    "default_priority_level": 0,
    "priority_queue_policy": {}
  },
  "instance_group": [
    {
      "name": "resnet50",
      "kind": "KIND_CPU",
      "count": 2,
      "gpus": [],
      "secondary_devices": [],
      "profile": [],
      "passive": false,
      "host_policy": ""
    }
  ],
  "default_model_filename": "model.savedmodel"
}
```

After defining the model repository, we need to start the Triton Inference Server with the given model repository as an argument. The easiest way of doing it is with Docker. Simply run the command with the desired version:

```bash
docker run --rm -p8000:8000 -p8001:8001 -p8002:8002 \
  -v/path/to/model_repository:/models \
  nvcr.io/nvidia/tritonserver:23.08-py3 \
  tritonserver --model-repository=/models
```

If everything works as expected, you should see the logs in the following format:

```
I0926 11:37:40.511677 1 server.cc:674]
+----------+---------+--------+
| Model    | Version | Status |
+----------+---------+--------+
| resnet50 | 1       | READY  |
+----------+---------+--------+
```

## Triggering the model from client

Now that the server is running, the applications will communicate this server using a client. Triton accepts gRPC and HTTP protocols.

The client will use the gRPC protocol to communicate with the server, and send an inference request. After receiving the response, we use the output name we received from the model metadata to access the output tensor returned from the server.

An example `client.py` can be seen below. Step by step, we first acquire an image, create a gRPC client for communicating with the server and receive the model metadata information using the model name we want to access. We then create the required input and output objects for the request to be processed. We then preprocess the image, feed it into the created input object, and then trigger inference. After receiving the response, we use the `output_names` we received from the metadata to retrieve the model output from the response under that name.

```python
#!/usr/bin/env python3

import ast
import urllib
from io import BytesIO

import numpy as np
import requests
import tensorflow as tf
import tritonclient.grpc as grpc_client
from PIL import Image

# Get imagenet class names as dictionary
r = urllib.request.urlopen(
    "https://gist.githubusercontent.com/yrevar/942d3a0ac09ec9e5eb3a/raw/238f720ff059c1f82f368259d1ca4ffa5dd8f9f5/imagenet1000_clsidx_to_labels.txt"
).read()
class2name = ast.literal_eval(r.decode())


def get_input_output_names_shapes(
    client: grpc_client.InferenceServerClient, model_name: str
):
    model_metadata = client.get_model_metadata(model_name)
    input_names = [input_tensor.name for input_tensor in model_metadata.inputs]
    output_names = [output_tensor.name for output_tensor in model_metadata.outputs]

    model_config = client.get_model_config(model_name)
    input_shapes = [input_tensor.dims for input_tensor in model_config.config.input]

    return input_names, output_names, input_shapes


def main():
    # Url to retrieve an image from the internet
    url = "https://i1.wp.com/robinbarefield.com/wp-content/uploads/2015/03/DSC_1763.jpg"
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))  # read the image with PIL

    model_name = "resnet50"  # Set the model name
    with grpc_client.InferenceServerClient(
        "localhost:8001"
    ) as client:  # connect to the server
        # Get the names and shapes of the input and output tensors
        input_names, output_names, input_shapes = get_input_output_names_shapes(
            client, model_name
        )

        # Resize the image to expected input shape of the model
        width, height = input_shapes[0][0], input_shapes[0][1]
        img = img.resize((width, height))

        # Convert the downloaded image to RGB
        input_data = np.array(img.convert("RGB")).astype(np.float32)

        # Preprocess the image for the ResNet50 model
        input_data = tf.keras.applications.resnet50.preprocess_input(input_data)

        # Add the dimension for the batch size
        input_data = np.expand_dims(input_data, 0)

        # Create and fill the actual input tensor to the model
        input_tensor = grpc_client.InferInput(input_names[0], input_data.shape, "FP32")
        input_tensor.set_data_from_numpy(input_data)

        # Run inference
        inputs = [input_tensor]
        outputs = [
            grpc_client.InferRequestedOutput(output_name)
            for output_name in output_names
        ]
        result = client.infer(model_name=model_name, inputs=inputs, outputs=outputs)

        # Print out predicted class name
        print(class2name[np.argmax(result.as_numpy(output_names[0]))])


if __name__ == "__main__":
    main()
```

When we run the above script with the image,

![Bear image](https://i1.wp.com/robinbarefield.com/wp-content/uploads/2015/03/DSC_1763.jpg)

we get the following output:
```
❯ python client.py
brown bear, bruin, Ursus arctos
```

## Next steps

We now have deployed a ResNet50 model inside a Triton Inference Server and performed inference using our Python client! The source code of the above examples can be found [here](https://github.com/keremyldrr/triton-workshop/tree/main). Next chapters in this tutorial series will cover the more advanced options of the Triton Inference Server. We will use the Triton Model Analyzer to optimize the model configuration for our requirements, carry the preprocessing computation to the Triton, and develop a mini web application that runs on cloud with the client. Stay tuned!
