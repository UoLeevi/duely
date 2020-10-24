FROM node:14-alpine AS build
RUN apk add --update --no-cache python make g++
WORKDIR /src
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:14-alpine
EXPOSE 3000
WORKDIR /usr/src/app
COPY --from=build /src .
USER node
CMD ["npm", "start"]
