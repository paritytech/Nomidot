FROM node:alpine3.10

WORKDIR /server
COPY . .

# To make the build fast
COPY package.json .
COPY yarn.lock .

RUN yarn

CMD ["yarn", "start"]