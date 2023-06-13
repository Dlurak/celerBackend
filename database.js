const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const config = require('./config.json');



const client = new mongodb.MongoClient(
    `mongodb+srv://${config.mongoDbUser}:${config.mongoDbPassword}@celer.zog6iqk.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = client.db('celer');

async function findUser(username) {
    return await db.collection('users').findOne({ _id: username });
}

async function addUser(username, passwordClearString) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordClearString, saltRounds);

    if (await findUser(username)) {
        return new Promise(resolve => resolve('User already exists'));
    }

    return new Promise((resolve, reject) => {
        db.collection('users').insertOne({
            _id: username,
            username: username,
            password: passwordHash,
            createdAt: new Date().getTime()
        }).then(() => {
            resolve('success');
        }).catch((error) => {
            console.error(error);
            reject('error');
        }
        );
    });

}

async function checkPasswordUsernameCombination(username, passwordClearString) {
    const user = await findUser(username);

    if (!user) { // user does not exist
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000)); // wait random time to prevent timing attacks
        return false;
    }
    return await bcrypt.compare(passwordClearString, user.password) // compare password hashes
}

// close the db connection when the Node process ends
process.on('SIGINT', () => {
    client.close().then(() => {
        console.log('Closed database connection');
        process.exit(0);
    });
});

module.exports = {
    addUser: addUser,
    checkPasswordUsernameCombination: checkPasswordUsernameCombination,
    client: client
};
