### Nomidot Server

Provides a GraphQL API for querying the node_watcher and app DBs.

Access is limited to services within the same cluster.

For development, make sure `node_watcher` is running in docker.

#### How to run locally
Make sure to populate the nodewatcher db to some extent locally before trying out any queries!

*In node_watcher:*
2. `docker-compose up`
3. `yarn`
4. `PRISMA_ENDPOINT=http://127.0.0.1:4466 START_FROM=850000 yarn start` ... change the `START_FROM` as necessary.
5. Let this run and populate your local PSQL DB for a while. In another step we'll look at querying from the hosted staging DB from CloudSQL with port forwarding.

*In server:*
1. `yarn`
2. `PRISMA_ENDPOINT=http://127.0.0.1:4466 yarn start`
3. Navigate to `localhost:4000` to view the GraphQL interface.

#### How to connect to hosted Server instance from a local frontend in development
1. Get a Google Cloud account
2. In terminal login to your Gcloud: `gcloud auth login`
3. Connect to the `test-installations-222013/dashboards-cluster` with `gcloud container clusters get-credentials dashboards-cluster-1 --zone europe-west1-b --project test-installations-222013`
4. Get the name of the running pod of the server: `kubectl get pods`
5. Forward the port: `kubectl port-forward <the-pod-name> 4001:4000`
6. Run the frontend and set the graphql endpoint to `localhost:4001`

#### How to query from the staging db
1. Get the name of the running Prisma Server (nodewatcher-<pod-id>): `kubectl get pods`
2. Forward the port: `kubectl port-forward <the-pod-name> 4467:4466`
3. Run `PRISMA_ENDPOINT=http://127.0.0.1:4467 yarn start`

* N.B. you can also go to `http://localhost:4467/_admin` to view the Prisma admin dashboard for the staging DB.