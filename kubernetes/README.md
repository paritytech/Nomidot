### Nodewatcher deployment

Consists of the following components:

* nodewatcher
  - Prisma graphql server written in Java
  - RW access to the postgreSQL DB

* server
  - Prisma graphql server written in Java
  - RO access to the DB
  - Acts as a public facing  frontend service 

* nodewatcher-job
  - Long running batchjob written in TypeScript 
  - Reading chaindata from a Polkadot RPC fullnode 
  - Writing into db? / nodewatcher? 

* PostreSQL DB
  - Managed by google Cloud-SQL
  - Deployed vi Terraform
