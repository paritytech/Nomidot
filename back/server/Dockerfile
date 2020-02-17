FROM node:alpine3.10

WORKDIR /server

# To make the build fast
COPY package.json .

# Install dependencies
RUN yarn

COPY ./ ./

CMD ["yarn", "start"]