FROM node:8.7

RUN mkdir -p /app/
COPY . /app/
WORKDIR /app

CMD npm i; npm run build