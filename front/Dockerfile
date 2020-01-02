FROM node:alpine3.10

WORKDIR /
COPY . .

RUN yarn

RUN chmod +x ./scripts/clean-build.sh
RUN chmod +x ./scripts/run-prod.sh

CMD ["./scripts/clean-build.sh", "./scripts/run-prod.sh"]