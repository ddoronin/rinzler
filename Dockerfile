FROM mhart/alpine-node:10
RUN apk add --no-cache make gcc g++ python \
    && npm i lerna -g
WORKDIR /app
COPY . .
RUN npm i \
    && (cd packages/rinzler-vue && npm i && npm rebuild node-sass && npm run build) \
    && (cd packages/rinzler-server && npm i)
EXPOSE 80 8080 27017
CMD npm run start:rinzler & npm run start:rinzler-server
