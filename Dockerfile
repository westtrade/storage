FROM node:alpine

WORKDIR /application

LABEL maintainer="Popov Gennadiy <gennadiy.popov.87@yandex.ru>"

# COPY . .

RUN yarn

EXPOSE 8080

CMD ["yarn", "start"]