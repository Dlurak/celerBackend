import express, { Request, Response } from 'express';
import { User } from '../interfaces/user';
import database = require('../database');
import { Session } from 'express-session';

const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    res.render('login');
});


router.post('/', (req: Request, res: Response) => {
    const { username, password } = req.body;
    const session = req.session as Session;
    
    database.checkPasswordUsernameCombination(username, password).then((user: User) => {
        if (user) {
            req.session.loggedIn = true;
            req.session.username = username;
            res.status(200).json({ message: 'You are logged in' });
        } else {
            res.status(401).json({ error: 'Wrong credentials' });
        }
    });
});


module.exports = router;
