FROM node:alpine3.10

WORKDIR /
COPY . .

RUN yarn

RUN chmod +x ./scripts/run-prod.sh

CMD ["./scripts/run-prod.sh"]