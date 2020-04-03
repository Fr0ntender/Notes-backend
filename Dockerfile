FROM node:12.10.0-alpine

RUN apk add git \
    cd home/ \
    && git clone https://github.com/eduard-kirilov/Notes-backend.git notes \
    && cd notes \
    && npm i -g nodemon \
    && yarn

WORKDIR /home/notes

EXPOSE 3001

CMD ["nodemon", "src/index.js"]
