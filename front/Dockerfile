FROM node:alpine3.10

WORKDIR /
COPY . .

WORKDIR /context
RUN yarn

WORKDIR /gatsby
RUN yarn

CMD ["yarn", "serve"]