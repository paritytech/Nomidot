## Prerequisites
1. Install Prisma: `yarn add prisma`

## Instructions to run locally:

1. Push up the Postgresql and Prisma images: `docker-compose up -d`
2. Generate and Deploy the Prisma datamodel: `prisma deploy` or `yarn build` 
3. Have a Polkadot node running: `/path/to/polkadot/target/release/polkadot`
4. Run the script: `yarn start`