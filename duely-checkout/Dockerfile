FROM node:14-alpine AS build
RUN apk add --update --no-cache python make g++
WORKDIR /src
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:14-alpine
EXPOSE 8080
WORKDIR /usr/src/app
COPY --from=build /src/node_modules node_modules
COPY --from=build /src/dist dist
USER node
CMD ["node", "./dist/index.js"]
