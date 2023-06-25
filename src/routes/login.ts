import express, { Request, Response } from 'express';
import database = require('../database/users');
import { Session } from 'express-session';
import { db } from '../database/database';
import { addSession } from '../database/sessions';

const router = express.Router();


router.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const session = req.session as Session;

    if (!username || !password) {
        res.status(400).json({ error: 'Missing credentials' });
        return;
    }

    const userExists = await database.doesUsernameExist(username, db);
    if (!userExists) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000)); // wait random time to prevent timing attacks
        res.status(401).json({ error: 'Wrong credentials' });
        return;
    }

    database.checkPasswordUsernameCombination(username, password, db).then((correct: boolean) => {
        if (correct) {
            session.loggedIn = true;
            session.username = username;
            session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week
            session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
            session.cookie.httpOnly = true;


            addSession(session, db).then((result) => {
                console.log(result);
            });

            res.status(200).json({
                message: 'You are logged in',
                username: username,
                sessionCookie: session.cookie,
                sessionID: session.id
            });
        } else {
            res.status(401).json({ error: 'Wrong credentials' });
        }
    });
});


router.all('/', (req: Request, res: Response) => {
    res.status(405).json({ error: 'Method not allowed' });
});

module.exports = router;
