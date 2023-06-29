import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // This gets the token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });

    }

    try {
        const decoded = jwt.verify(token, (process.env.JWT_SECRET as string)) as JWTPayload;
        console.table({
            'decoded': decoded,
            'Originated from':'src/middleware/auth.ts:19'
        });
        res.locals.jwtPayload = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export default authenticate;