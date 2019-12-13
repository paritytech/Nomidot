# @substrate/node-watcher

## Instructions to run locally:

1. Push up the Postgresql and Prisma images: `docker-compose up -d`
2. Run the script which populates the database: `yarn start`

## (minikube)
1. `minikube start`
2. `kompose convert && kompose up`
3. Then `kubectl describe svc SERVICE_NAME`
4. Get the IP and check you can curl it

## Google Kubernetes Engine Deployment
1. `kubectl create -f polkdot-dashboards`
2. 
