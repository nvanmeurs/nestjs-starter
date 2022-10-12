FROM node:lts-alpine as build-stage

RUN apk --no-cache add python3 make g++

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build

# Entrypoint to run migrations, not executed during build
CMD [ "npm", "run", "migrate:prod" ]

FROM node:lts-alpine

ENV NODE_ENV production

WORKDIR /app

RUN npm install --location=global pm2
RUN npm prune --production

COPY --from=build-stage --chown=node:node node_modules node_modules
COPY --from=build-stage --chown=node:node dist dist

EXPOSE 4000
CMD [ "pm2-runtime", "dist/main.js" ]