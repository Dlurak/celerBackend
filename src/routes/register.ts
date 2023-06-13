import express, { Request, Response } from 'express';
const router = express.Router();
const fs = require('fs');
import { config } from '../config';
const database = require('../database');

router.get('/', (req: Request, res: Response) => {
    res.render('register');
});

router.post('/', (req: Request, res: Response) => {
    const requestBody = req.body;

    if (requestBody.password !== requestBody.passwordRepeat) { // check if passwords match
        res.status(400).json({ error: 'Passwords do not match' });
    } else if (!requestBody.password.match(new RegExp(config.passwordRegex))) { // match a secure password
        res.status(400).json({
            error: "Password isn't secure enough",
            message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
        });
    } else { // add user to database
        database.addUser(requestBody.username, requestBody.password).then((response: string) => {
            switch (response) {
                case 'success':
                    res.status(200).json({ message: 'User added successfully' });
                    break;
                case 'User already exists':
                    res.status(400).json({ error: 'User already exists' });
                    break;
                case 'error':
                    res.status(500).json({ error: 'Internal server error' });
                    break;
                default:
                    res.status(500).json({ error: 'Unknown behaviour' })
            }
        });
    }
});

module.exports = router;