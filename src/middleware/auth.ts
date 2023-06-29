import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // This gets the token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });

    }

    jwt.verify(token, (process.env.JWT_SECRET as string), (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        res.locals.jwtPayload = decoded;
        next();
    });
};

export default authenticate;