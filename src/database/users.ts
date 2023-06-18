import { Db, ObjectId } from 'mongodb';
import { User, UserSearchOptions } from '../interfaces/user';
const bcrypt = require('bcrypt');

/**
 * A function to find users in the database
 * @param user Object containing the search options
 * @param db The database to search in
 * @returns A promise containing an array of users that match the search options
 */
export async function findUsers(user: UserSearchOptions, db: Db): Promise<User[]> {
    const users = await db.collection<User>('users')
        .find(user)
        .toArray();
    
    return users;
}

/**
 * A function to check whether a username exists in the database
 * @param username The username to check
 * @param db The database to check in
 * @returns A promise containing a boolean indicating whether the username exists
 */
export async function doesUsernameExist(username: string, db: Db): Promise<boolean> {
    const user = await db.collection('users').findOne({ username: username });
    return user !== null;
}

/**
 * A function to check whether a user id exists in the database
 * @param id The id to check
 * @param db The database to check in
 * @returns A promise containing a boolean indicating whether the id exists
 */
export async function doesUserIdExist(id: ObjectId, db: Db): Promise<boolean> {
    const user = await db.collection('users').findOne({ _id: id });
    return user !== null;
}

/**
 * A function to add a user to the database
 * @param username The username of the user to add
 * @param passwordClearString The unhased password of the user to add
 * @param db The database to add the user to
 * @returns A promise containing a string indicating whether the user was added successfully
 */
export async function addUser(username: string, passwordClearString: string, db: Db): Promise<"success" | "error" | "User already exists"> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordClearString, saltRounds);

    if (await doesUsernameExist(username, db)) { // check if user already exists
        return new Promise(resolve => resolve('User already exists'));
    }

    return new Promise((resolve, reject) => { // add a user to the database when it does not exist yet
        db.collection('users').insertOne({
            _id: new ObjectId(),
            username: username,
            password: passwordHash,
            createdAt: new Date().getTime(),
            blocked: false
        }).then(() => { // return 'success' when user is added
            resolve('success');
        }).catch((error: Error) => {
            console.error(error);
            reject('error');
        }
        );
    });

}

/**
 * A function to check whether a username and password combination is correct
 * @param username The username of the user to check
 * @param passwordClearString The unhased password of the user to check
 * @param db The database to check in
 * @returns A promise containing a boolean indicating whether the username and password combination is correct
 */
export async function checkPasswordUsernameCombination(username: string, passwordClearString: string, db: Db): Promise<boolean> {
    return findUsers({ username: username }, db).then((userList) => {
        const user = userList[0];
        if (!user) { // user does not exist
            return new Promise(async (resolve) => {
                await new Promise(resolve => setTimeout(resolve, Math.random() * 1000)); // wait random time to prevent timing attacks
                resolve(false);
            });
        }
        return bcrypt.compare(passwordClearString, user.password);
    });
}

