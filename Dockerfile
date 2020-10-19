FROM node:13.6.0-alpine as BUILD

RUN \
  apk add --no-cache --virtual .gyp python make g++ \
  && apk --no-cache add avahi-dev

COPY . .

RUN \
  npm install --no-save \
  && apk del .gyp \
  && npm run build

# ---

FROM node:13.6.0-alpine


RUN addgroup -g 1993 -S bot \
  && adduser -u 1993 -S bot -G bot

COPY package.json /app/
COPY --from=BUILD node_modules/ /app/node_modules/
COPY --from=BUILD dist/bundle.js /app/dist/bundle.js
WORKDIR /app

ENTRYPOINT [ "npm", "run", "start" ]
