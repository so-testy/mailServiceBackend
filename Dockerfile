FROM node:alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install --loglevel=error

COPY .env /usr/src/app/
COPY .babelrc /usr/src/app/
COPY src /usr/src/app/src

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

CMD /wait && npm start --loglevel=error
