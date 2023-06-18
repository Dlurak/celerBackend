const mongodb = require('mongodb');
import { config } from '../config';

/**
 * The database connection
 */
const client = new mongodb.MongoClient(
    `mongodb+srv://${config.mongoDbUser}:${config.mongoDbPassword}@celer.zog6iqk.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = client.db('celer');



process.on('SIGINT', () => {
    client.close().then(() => {
        console.log('Closed database connection');
        process.exit(0);
    });
});

export { db, client };