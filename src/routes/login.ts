import express, { Request, Response } from 'express';
import database = require('../database/users');
import { generateToken } from '../utils/auth';
import { db } from '../database/database';

const router = express.Router();


router.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;

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
            
            const token = generateToken(username);

            res.status(200).json({
                message: 'You are logged in',
                username: username,
                token: token
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
