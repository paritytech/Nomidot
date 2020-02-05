FROM node:alpine3.10

WORKDIR /
COPY . .

WORKDIR /ui-components
RUN yarn

WORKDIR /context
RUN yarn

WORKDIR /gatsby
RUN yarn

CMD ["yarn", "start:prod"]
