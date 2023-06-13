import express, { Request, Response } from 'express';
import session = require('express-session');
import { config } from './config';

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');


const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    saveUninitialized: false
}))

// define the routers
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

// start the server
app.listen(3000, () => {
    console.log('listening on 3000');
});


app.route('/').get((req: Request, res: Response) => {
    res.render('index');
});


