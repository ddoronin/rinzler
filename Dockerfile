FROM mhart/alpine-node:10
RUN apk add --no-cache make gcc g++ python \
    && npm i lerna -g
WORKDIR /app
COPY . .
RUN yarn \
    && (cd packages/rinzler-vue && yarn build)
EXPOSE 80 8080 27017
CMD yarn start:rinzler & yarn start:rinzler-server
