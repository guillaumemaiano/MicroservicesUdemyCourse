# Kubernetes Services

## There are four types of services

| Type  | Use |
| ------------- | ------------- |
| Cluster IP  | Access pod easily, exposes pods *IN* the cluster.  |
| Load Balancer  | Expose a pod to the outside world, *outside* of the cluster  |
| Node Port | Makes a pod accessible from outside of the cluster, mostly for development purposes |
| External Name | Redirects an in-cluster request to a CNAME URL. [ Highly specialized use only] |
