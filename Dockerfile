FROM mhart/alpine-node:10
RUN apk add --no-cache make gcc g++ python \
    && npm i lerna -g
WORKDIR /app
COPY . .
RUN yarn \
    && (cd packages/rinzler-vue && yarn build) \
    && cp -r packages/rinzler-vue/dist packages/rinzler/public \
    && rm -rf node_modules \
    && rm -rf packages/rinzler-vue \
    && yarn install --production=true

FROM mhart/alpine-node:10
WORKDIR /app
COPY --from=0 /app .
EXPOSE 80 8080 27017
CMD yarn start:rinzler & yarn start:rinzler-server
