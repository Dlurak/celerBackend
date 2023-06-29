import express, { Request, Response } from 'express';

const router = express.Router();


//  a route for the logout that requires the user to be logged in
router.get('/', (req: Request, res: Response) => {
    res.status(500).json({ error: 'Not implemented yet, due to the rewriting to jwt' });
});

module.exports = router;