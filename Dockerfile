FROM mhart/alpine-node:10
RUN apk add --no-cache make gcc g++ python \
    && npm i lerna -g
WORKDIR /app
COPY . .
RUN yarn install \
    && (cd packages/rinzler-vue && yarn build) \
    && mv packages/rinzler-vue/dist/* packages/rinzler-server/www \
    && rm -rf node_modules \
    && rm -rf packages/rinzler-vue \
    && yarn install

FROM mhart/alpine-node:10
WORKDIR /app
COPY --from=0 /app .
ENV TS_NODE_TRANSPILE_ONLY=true \
    PORT=80 \
    MONGO_URL=mongodb://host.docker.internal:27017
EXPOSE 80 27017
CMD yarn start
