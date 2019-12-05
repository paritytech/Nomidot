FROM node:alpine3.10

ENV PRISMA_ENDPOINT http://prisma:4466

WORKDIR /node_watcher
COPY . .

# Install dependencies
RUN yarn
# Create the database schema
CMD ["yarn", "prisma", "deploy"]
