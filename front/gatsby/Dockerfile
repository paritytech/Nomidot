FROM node:alpine3.10

WORKDIR /gatsby

ENV NODE_ENV staging

COPY ./package.json .

RUN yarn install --production

RUN yarn build

COPY ./public .

EXPOSE 9000

CMD ["yarn", "gatsby", "serve"] 