import { Session } from 'express-session';
import { Db, ObjectId } from 'mongodb';


/**
 * 
 * @param session The session to store in the database
 * @param db The database to store the session in
 * @returns A promise containing a string indicating whether the session was added successfully
 */
export function addSession(session: Session, db: Db): Promise<'success' | 'error'> {
    return new Promise((resolve, reject) => {
        db.collection('session').insertOne({
            _id: new ObjectId(),
            sessionID: session.id,
            username: session.username,
            cookie: session.cookie,
            expires: session.cookie.expires?.getTime(),
            createdAt: new Date().getTime()
        }).then(() => {
            resolve('success');
        }).catch((error: Error) => {
            console.error(error);
            reject('error');
        });
    });
}
