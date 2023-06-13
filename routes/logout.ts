import express, { Request, Response } from 'express';
import { loggedIn } from '../middleware/session';

const router = express.Router();


//  a route for the logout that requires the user to be logged in
router.get('/', (req: Request, res: Response) => {
    const loggedInBool = loggedIn(req);
    if (loggedInBool) {
        req.session.destroy(() => { });
        res.status(200).json({ message: 'You are logged out' });
    } else {
        res.status(400).json({ error: 'You are not logged in' });
    }
});

module.exports = router;