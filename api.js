const express = require('express');
const fs = require('fs');
const database = require('./database');
const config = JSON.parse(fs.readFileSync('./config.json'));
const session = require('express-session');


const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    saveUninitialized: false,
}));

const requireLogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
};

app.listen(3000, () => {
    console.log('listening on 3000');
});


app.route('/').get((req, res) => {
    res.render('index');
});

app.route('/register').get((req, res) => {
    res.render('register');
});

app.route('/register').post(async (req, res) => {
    const requestBody = req.body;

    if (requestBody.password !== requestBody.passwordRepeat) { // check if passwords match
        res.status(400).json({ error: 'Passwords do not match' });
    } else if (!requestBody.password.match(new RegExp(config.passwordRegex))) { // match a secure password
        res.status(400).json({
            error: "Password isn't secure enough",
            message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
        });
    } else { // add user to database
        const addUser = await database.addUser(requestBody.username, requestBody.password).then((response) => {
            console.log(response);
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

app.route('/login').get((req, res) => {
    res.render('login');
});

app.route('/login').post((req, res) => {
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


app.route('/logout').get(requireLogin, (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'You are logged out' });
});
