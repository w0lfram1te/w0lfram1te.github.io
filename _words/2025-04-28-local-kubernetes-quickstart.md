---
title: Local Kubernetes Quickstart
date_created: 2025-04-28
date_updated: 2025-04-28
metadata: howto
---
# Local Kubernetes Quickstart 

The goal of this post is to get from no access to Kubernetes to something that can be explored for study or experimentation. Deploying on cloud services such as Amazon's EKS, GCP's GKE takes time to deploy from scratch and has cost implications which may be prohibitive for some.

Make sure to have [Docker installed](https://docs.docker.com/engine/install/) before proceeding with the rest of the document.
## Kind Installation

[Kind](https://kind.sigs.k8s.io/) is a way for deploying local Kubernetes clusters by simulating the control plane/master node and worker nodes through the use of Docker containers.

Simply run the following commands if you have `go` installed on your system. 

```sh
go install sigs.k8s.io/kind@v0.27.0
```

or, alternatively, it can be installed through a package manager for Windows / MacOS.

```sh
# windows
choco install kind

# macOS
brew install kind
```
## Running the Cluster

Run the command below to initialize the cluster and setting the appropriate context in `kubectl`. Make sure to install `kubectl` to run commands to interface with the Kubernetes API Server.

```sh
kind create cluster --name k8s-test
```

![](_media/Pasted%20image%2020250423230225.png)
## Deploying Nginx

There are several ways for creating resources on Kubernetes. For this quickstart we will be making use of quick-to-use `kubectl` commands just so there's less faffing around with YAMLs. The various ways of wrangling YAMLs will be a dedicated discussion later.

**Nginx Pod**

The command below pulls the most recent version of `nginx` and deploys it as a `Pod`. By default Nginx runs the webserver and listens on port 80 so we indicate that port 80 should be exposed on the pod through the `--port` argument.

```sh
kubectl run web --image=nginx --port=80
```


![](_media/Pasted%20image%2020250428224527.png)

You can watch the pod deployment process by running the `get pods` command with the `-w` flag. Initially the status will be `ContainerCreating` while it pulls the image, if needed, and starts to create the pod. After a couple seconds the status should say `Running`.

```sh
kubectl get pods -w
```

![](_media/Pasted%20image%2020250424005357.png)

**Exposing the Pod's Ports**

By default, the pod will not have a port that is exposed to outside the cluster. Network communication to pods are best done through a service. Run the following command to create a `Service` resource and associate it with the running Pod.

```sh
kubectl expose pod web --name=web-svc --port=8080 --target-port=80
```

![](_media/Pasted%20image%2020250428230621.png)

The service has exposed port 8080 and routes all traffic it receives on that port to the pod's port 80. Because the network that the service is running on is different from the local host's network, we have to port-forward to gain access to the service and pod.

```sh
kubectl port-forward svc/web-svc 8080:8080
```

![](_media/Pasted%20image%2020250428230718.png)

The Nginx pod can now be accessed using curl at `http://127.0.0.1:8080`.

![](_media/Pasted%20image%2020250428224619.png)

---
## Cleanup

I found that most of the most useful guides on Kubernetes also include how to clean up the created resources on the guide. This will allow for better recall on the created resources from a learning point-of-view and better resource management when deploying real workloads.

**Deleting the created resources on the cluster

```sh
kubectl delete pod/web svc/web-svc
```

**Deleting the cluster itself**

```sh
kind delete cluster --name k8s-test
```

## Bonus Tip

I tend to get very lazy when typing out commands using kubectl - I like creating an alias for `kubectl` on my terminal. Add the following lines to your respective terminal initialization script like `~/.bashrc` or `~/.zshrc`:

```sh
alias k=kubectl
```