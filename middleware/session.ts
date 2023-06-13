import { Request } from 'express';

export function loggedIn(req: Request): boolean {
    return !!req.session.loggedIn;
}