FROM node:13.6.0-alpine

WORKDIR /src

RUN \
  apk add --no-cache --virtual .gyp python make g++ \
  && apk --no-cache add avahi-dev

COPY . .

RUN \
  yarn \
  && apk del .gyp \
  && yarn build

CMD yarn start
