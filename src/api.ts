import express, { Request, Response } from 'express';
import { config } from './config';
import path from 'path';
import cors from 'cors';
import bodyParser = require('body-parser');

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const rideRequestRouter = require('./routes/rideRequest');


const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// define the routers
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/rideRequest', rideRequestRouter);

// start the server
app.listen(3000, () => {
    console.log('listening on 3000');
});


app.route('/').all((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
});
