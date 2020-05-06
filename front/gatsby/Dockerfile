FROM node:alpine3.10

WORKDIR /gatsby

COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn

COPY . .

CMD ["yarn", "start:prod"]