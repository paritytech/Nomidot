FROM node:12.0.0-alpine

# ENV PRISMA_ENDPOINT http://prisma:4466

WORKDIR /node_watcher

# To make the build fast
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn

COPY ./ ./

# Create the database schema
CMD ["yarn", "prisma", "deploy"]

