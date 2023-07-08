import { Db } from "mongodb";

const mongodb = require('mongodb');
require('dotenv').config();

/**
 * The database connection
 */
const client = new mongodb.MongoClient(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@celer.zog6iqk.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const db: Db = client.db('celer');



process.on('SIGINT', () => {
    client.close().then(() => {
        console.log('Closed database connection');
        process.exit(0);
    });
});

export { db, client };