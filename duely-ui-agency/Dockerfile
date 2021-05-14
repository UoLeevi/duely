FROM node:16-alpine AS build
RUN apk add --update --no-cache python3 make g++
WORKDIR /src
COPY . .
RUN npm i --no-package-lock
RUN npm run build

FROM nginx
COPY --from=build /src/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist/ /src/assets/ /usr/share/nginx/html/
