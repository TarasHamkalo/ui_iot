FROM node:alpine
LABEL authors="taras-hamkalo"

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install -g @angular/cli
RUN npm install -g @angular/

RUN npm install

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
