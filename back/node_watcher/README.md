# @substrate/node-watcher
Long living script that reads from an archive node and loads select information to a Postgresql DB, a.k.a ETL.

The tasks specific to Nomidot are in `src/tasks`

The script itself lives in `nodeWatcher.ts`, and anyone can write their own `tasks` suited to their needs as long as they conform to the `Task` interface. It is agnostic of what server or db one decides to use.

### Instructions to run locally:
1. Push up the Postgresql and Prisma images: `docker-compose up -d`
2. Run the script which populates the database: `yarn start`

### On a Local Kubernetes Cluster (minikube) (writes to CloudSQL)
1. Start local cluster `minikube start`
2. Make sure kubectl is connected to is `kubectl cluster-info`
3. Follow same steps as below

### On Hosted Google Kubernetes Engine
1. Mount secrets to nodewatcher pod's volume: `kubectl create -f path/to/secrets.yaml`
<!-- 2. Mount configmaps to cluster: `kubectl create -f path/to/configmaps.yaml` -->
3. Create namespaces: `kubectl create -f path/to/namespace.yaml`
  - Make sure you're in the appropriate namespace: `kubectl config set-context --current --namespace<namespace>`
  - Verify: `kubectl config view --minify | grep namespace:`
4. Create nodewatcher deployment: `kubectl create -f path/to/nodewatcher_deployment.yaml`
5. Create service: `kubectl create -f path/to/service.yaml`
6. Get the nodewatcher deployment IP: `kubectl describe deployments nodewatcher` 
7. Set `PRISMA_ENDPOINT` in `nomidotwatcher-deployment.yaml` to External IP from step 6.
8. Allow traffic: `gcloud compute firewall-rules create allow-nodewatcher-nodeport --allow=tcp:31000`

### Make a rolling update:
  - Docker Tag the new image(s) `docker tag node_watcher_main eu.gcr.io/kusama-etl/node_watcher:v1.0`
  - Push it to container registry `docker push eu.gcr.io/kusama-etl/node_watcher:v1.0`
  - Get the current image name `kubectl describe pods ${POD_NAME}`
  - Set new deployment image `kubectl set image ${current_image} ${new_image}`
  - Confirm with `kubectl rollout status deployments/${new_image}`
