
FROM node:alpine3.10

WORKDIR /gatsby

ENV NODE_ENV staging

COPY ./package.json .

RUN yarn install --production

COPY ./public .

EXPOSE 8000

CMD ["yarn", "gatsby", "serve"] 
