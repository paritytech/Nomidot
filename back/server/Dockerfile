FROM node:12.0.0-alpine

WORKDIR /server

COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn

COPY . .

CMD ["yarn", "start"]