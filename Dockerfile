FROM node:slim AS build
LABEL authors="taras-hamkalo"

ARG BUILD_ENV

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

COPY .env.$BUILD_ENV ./

RUN NG_APP_ENV=$BUILD_ENV ng build

FROM nginx:latest AS runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/ui_iot/browser /usr/share/nginx/html
EXPOSE 80