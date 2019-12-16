# @substrate/node-watcher

## Instructions to run locally:

1. Push up the Postgresql and Prisma images: `docker-compose up -d`
2. Run the script which populates the database: `yarn start`

## On a Local Kubernetes Cluster (minikube) (writes to CloudSQL)
1. `minikube start`
2. `kompose convert && kompose up`
3. Then `kubectl describe svc SERVICE_NAME`
4. Get the IP and check you can curl it

## On Hosted Google Kubernetes Engine
1. Mount secrets to nodewatcher pod's volume: `kubectl create -f path/to/secrets.yaml`
2. Mount configmaps to cluster: `kubectl create -f path/to/configmaps.yaml`
3. Create namespaces: `kubectl create -f path/to/namespace.yaml`
4. Create deployment: `kubectl create -f path/to/deployment.yaml`
5. Create service: `kubectl create -f path/to/service.yaml`
