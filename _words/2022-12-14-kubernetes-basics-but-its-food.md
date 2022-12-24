---
title: Kubernetes Basics but its Food 
date_created: 2022-12-18
date_updated: 2022-12-24
metadata: research
tags: 
---
# Kubernetes Basics but its Food

Due to the very frequent use of analogies related to food and cooking where I currently work, this discussion will make liberal use of food-related analogies. I will not be liable for any hungry readers after this. 

## What's an image? Whats a container?

Consider a basic application - a script that simply prints "hello, world!" every ten seconds. 

This application, when run on your machine, generally requires a lot of other things in the background to run. These requirements can be included in what is called an **image** which will contain all that the script needs to fulfill its one task of printing words to the terminal. 

Think of an image as a recipe for whatever dish you want - it has all of the ingredients and the necessary steps to put those ingredients together. A **container** is a single instance of that dish. One recipe (image) can be used to create several dishes (containers).

## So what's with Kubernetes?

Think about the recipe analogy once again. The container is a single package of whatever application that needs to be run - be it a script, a web server, a database, anything. Taking that one step further, Kubernetes extends that recipe-making functionality to the next level - declaring several containers at once, declaring how they connect and interact with each other, and how to ensure that there is an available container at all times. 

### 1. Declaring several containers at once?

A **pod** is an extension of the idea of containers. This time, it's a collection of containers in a single grouping. This is because sometimes you need to have several things running alongside each other to achieve what you need.

This could be as menial as downloading the most updated version of a binary or source code from a remote repository, or declaring containers specifically just for managing logs and other support-systems. 

Below is an example of a pod defined to download a file from the internet and to host that file on the webserver. 

```bash
apiVersion: v1
kind: Pod
metadata:
  name: web
  labels:
    app.kubernetes.io/name: web
spec:
  initcontainers:
    - name: download
      image: busybox
      command: 
        - wget
      args:
        - https://w0lfram1te.com/
    ...
  containers:
    - name: web
      image: nginx
      ports:
        - name: web
          containerPort: 80
          protocol: TCP
    ...
```

*Original taken from the [Kubernetes website](https://kubernetes.io/docs/tasks/configure-pod-container/static-pod/). Other sections of the manifest are left out to avoid overloading the reader with not-so-pertinent text.* 

### 2. Declaring how they connect and interact with each other?

Pods are generally designed to do one thing and kept very modular. If there is a need for several functions these containers should be defined as separate pods. This improves resiliency since one misconfigured container in one pod won't take everything else with it. 

Let's say we continue to use the pod from before, the web pod. We want to define another pod that can communicate with the web pod. To do that we need to declare a **service** 

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app.kubernetes.io/name: web
  ports:
    - protocol: TCP
      port: 80
      targetPort: web
```

From here, we can then instruct the other pods in the cluster to use the following addresses to communicate with the server:

```bash
# short-name 
curl http://web-service:80

# long-name
curl http://web-service.default.svc.cluster.local:80
```

### 3. Ensuring container availability?

Another feature kubernetes has is making sure that there are pods available as defined by the **deployment**. We can define the deployment to always have 3 copies of the pod running at all times and, when updating things, to deploy the new configuration in batches. 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: web
  template:
    {{POD_DEFINITION}}
```

To come back to that food-analogy I've been using: a deployment makes sure that there are a set number of dishes available for anyone who wants to eat 'em.

## Conclusion

That should provide a general idea of what Kubernetes is and its basic components. 

There are a lot more components that haven't been discussed and many other nuances that were missed in this very high-level introduction. Those will need to be learned in parts. It gets a bit unwieldy if done all at once. 


