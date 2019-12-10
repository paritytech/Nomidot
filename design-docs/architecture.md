---
layout: default
---

## Design

### Direction

The goal of this project is to provide a relational DB over a Kusama or Polkadot node for easy historical and grouped queries, while also maintaining the ability to write directly to a node.

To this end, it aims to:
- Keep a generic node watcher interface (`./back/node_watcher`) such that it is DB/Server agnostic (just supply the tasks)
- Guranteed to be live (rolling updates and replication)
- Abstract the complexity from UI development (all I/O goes through single GraphQL server endpoint)

### Architecture

![Architecture diagram](https://github.com/paritytech/nomidot.github.io/blob/HEAD/assets/Architecture.png "Architecture")

The architecture of this application is based on microservices. We use microservices to be as extensible as possible. Containers should be hosted on Google Container Registry.

While Nomidot and Polkassembly are separate projects, we deploy them to the same Kubernetes cluster under the microservices architecture (such that they can easily be merged should it be needed).

Each pod lives in its own namespace. We also keep two environments: staging and production.

Secrets (api keys, etc.) should obviously NEVER be pushed to remote repository. Secrets MUST be stored and mounted as a volume to the appropriate Pod.

All services communicate using GraphQL over HTTP or through JSON-RPC.