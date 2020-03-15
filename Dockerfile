FROM node:12.10.0-alpine

RUN apk add git \
    cd home/ \
    && git clone https://github.com/Frost0x/Notes-back.git notes \
    && cd notes \
    && npm i -g nodemon \
    && yarn

WORKDIR /home/notes

EXPOSE 3001

CMD ["nodemon", "src/index.js"]