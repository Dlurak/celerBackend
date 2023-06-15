import { Db, ObjectId } from 'mongodb';
const bcrypt = require('bcrypt');
import { User } from '../interfaces/user';


async function findUser(username: string, db: Db): Promise<User> {
    return db.collection('users')
        .findOne<User>({ username: username })
        .then((user) => {
            if (user === null) {
                throw new Error('User not found');
            } else {
                return Promise.resolve(user);
            }
        });
}

export async function doesUserExist(username: string, db: Db): Promise<boolean> {
    const user = await db.collection('users').findOne({ username: username });
    return user !== null;
}

export async function addUser(username: string, passwordClearString: string, db: Db): Promise<string> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordClearString, saltRounds);

    if (await doesUserExist(username, db)) { // check if user already exists
        return new Promise(resolve => resolve('User already exists'));
    }

    return new Promise((resolve, reject) => { // add a user to the database when it does not exist yet
        db.collection('users').insertOne({
            _id: new ObjectId(),
            username: username,
            password: passwordHash,
            createdAt: new Date().getTime()
        }).then(() => { // return 'success' when user is added
            resolve('success');
        }).catch((error: Error) => {
            console.error(error);
            reject('error');
        }
        );
    });

}

export async function checkPasswordUsernameCombination(username: string, passwordClearString: string, db: Db): Promise<boolean> {
    return findUser(username, db).then((user) => {
        if (!user) { // user does not exist
            return new Promise(async (resolve) => {
                await new Promise(resolve => setTimeout(resolve, Math.random() * 1000)); // wait random time to prevent timing attacks
                resolve(false);
            });
        }
        return bcrypt.compare(passwordClearString, user.password);
    });
}

