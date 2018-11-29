FROM mhart/alpine-node:10
RUN apk add --no-cache make gcc g++ python \
    && npm i lerna -g

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn \
    && (cd packages/rinzler-vue && yarn build)
RUN mkdir packages/rinzler-server/www \
    && cp -r packages/rinzler-vue/dist/* packages/rinzler-server/www \
    && (cd packages/rinzler-server && yarn compile) \
    && rm -rf node_modules \
    && rm -rf packages/rinzler-vue \
    && rm -rf packages/rinzler-server/node_modules \
    && rm -rf packages/rinzler-server/src \
    && yarn install --prod

FROM mhart/alpine-node:10
COPY --from=0 /app /app
WORKDIR /app
ENV TS_NODE_TRANSPILE_ONLY=true \
    PORT=80 \
    MONGO_URL=mongodb://host.docker.internal:27017
EXPOSE 80 27017
CMD cd ./packages/rinzler-server && node ./dist/server.js
