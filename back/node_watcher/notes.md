## Postgres Docker

* Get the latest docker image - `docker pull postgres:latest`
* Make a volumes directory on local machine to persist data after container instance is killed - `mkdir -p $HOME/docker/volumes/postgres`
* `docker run --rm   --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data  postgres`
    * —rm: remove the container upon exit
    * —name: give it a unique name
    * -e: set environment variables like the db password
    * -d: detached mode (run in the background)
    * -p: set the port
    * -v: tell it the path to the volume where to persist, i.e. mount the `$HOME/docker/volumes/postgres` to the docker container's side volume path `/var/lib/postgresql/data`
* `docker run -d -p 5432:5432 --name my-postgres -e`
