FROM node:16.13-alpine As development
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production=false

COPY . .
RUN yarn build

FROM node:16.13-alpine As production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
#TODO use google secret manager to handle env varriables
COPY package.json yarn.lock .env ./
RUN yarn install --production=true

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/main"]