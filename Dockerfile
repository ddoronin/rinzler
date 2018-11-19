FROM mhart/alpine-node:10
RUN apk add --no-cache make gcc g++ python
WORKDIR /app
COPY package*.json ./
RUN npm install \
    && lerna bootstrap
COPY . .
EXPOSE 8080 27017
CMD (cd ./packages/rinzler-vue && npm run build && cp -r dist/* ../rinzler/public) \
    && npm run start:rinzler & \
    && npm run start:rinzler-server
