FROM node:latest

# ENV PRISMA_ENDPOINT http://prisma:4466

WORKDIR /node_watcher
COPY . .

# Add wait-for https://github.com/eficode/wait-for
# ADD https://raw.githubusercontent.com/eficode/wait-for/master/wait-for /opt/bin/wait-for.sh
# RUN chmod +x /opt/bin/wait-for.sh

# Install dependencies
RUN yarn
# Create the database schema
# CMD ["/opt/bin/wait-for.sh", "prisma:4466", "--", "yarn", "prisma", "deploy"]
CMD ["yarn", "prisma", "deploy"]