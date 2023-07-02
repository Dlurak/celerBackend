import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser = require('body-parser');
import { config } from './config'

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const rideRequestRouter = require('./routes/rideRequest');


const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// define the routers
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/rideRequest', rideRequestRouter);

// start the server
app.listen(config.port, () => {
    console.log(`listening on ${config.port}`);
});


app.route('/').all((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
});
