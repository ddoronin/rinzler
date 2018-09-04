'use strict';

export const server = {
    port: (process.env.PORT as any) || 8080
};

export const mongo = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    db: process.env.MONGO_DB || 'test',
    collection: 'zips'
};
