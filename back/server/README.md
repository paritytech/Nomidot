## Graphql Yoga Server

This is the public facing API to be able to query what's been populated by the node_watcher.

### Local Development
The cloudsql database is only accessibly from within the cluster, so you won't be able to query it for local development.

Instead, you should run the docker image db, populate it and then query that.

1. Make sure you have Docker running
2. `cd node_watcher && docker-compose up -d`
3. `yarn start`
3. `cd node_server && docker-compose up -d`
4. `PSQL=http://127.0.0.1:5432 yarn start`



