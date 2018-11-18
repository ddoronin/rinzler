FROM mhart/alpine-node:10
RUN apk add --no-cache make gcc g++ python
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
EXPOSE 27017
CMD ["./run.sh"]
