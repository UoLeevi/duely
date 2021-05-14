FROM node:14-alpine AS build
RUN apk add --update --no-cache python make g++
WORKDIR /src
COPY . .
RUN npm ci
RUN npm run build

FROM nginx
COPY --from=build /src/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist/ /src/assets/ /usr/share/nginx/html/
