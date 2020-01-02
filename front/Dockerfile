FROM node:alpine3.10

WORKDIR /
COPY . .

RUN yarn

RUN chmod +x run-prod.sh

CMD ["./clean-build.sh", "./run-prod.sh"]