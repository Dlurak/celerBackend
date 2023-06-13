const express = require('express');
const database = require('../database');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('login');
});


router.post('/', (req, res) => {
    const { username, password } = req.body;
    database.checkPasswordUsernameCombination(username, password).then((user) => {
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
