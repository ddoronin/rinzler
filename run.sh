#!/bin/bash

(cd ./packages/rinzler-vue && npm run build && cp -r dist/* ../rinzler/public)
npm run start:rinzler &
npm run start:rinzler-server
