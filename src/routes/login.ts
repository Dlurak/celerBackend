import express, { Request, Response } from 'express';
import { User } from '../interfaces/user';
import database = require('../database/users');
import { Session } from 'express-session';
import { db } from '../database/database';

const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    res.render('login');
});


router.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const session = req.session as Session;

    if (!username || !password) {
        res.status(400).json({ error: 'Missing credentials' });
        return;
    }

    const userExists = await database.doesUserExist(username, db);
    if (!userExists) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000)); // wait random time to prevent timing attacks
        res.status(401).json({ error: 'Wrong credentials' });
        return;
    }
    
    database.checkPasswordUsernameCombination(username, password, db).then((correct: boolean) => {
        if (correct) {
            session.loggedIn = true;
            session.username = username;
            res.status(200).json({ message: 'You are logged in' });
        } else {
            res.status(401).json({ error: 'Wrong credentials' });
        }
    });
});


module.exports = router;
