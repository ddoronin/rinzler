'use strict';

exports.server = {
    port: process.env.PORT || 8080
};

exports.mongo = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    db: process.env.MONGO_DB || 'test',
    collection: 'zips'
};
