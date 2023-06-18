import { Request } from 'express';

/**
 * A function to check whether a user is logged in
 * @param req The request to check
 * @returns A boolean indicating whether the user is logged in
 */
export function loggedIn(req: Request): boolean {
    return !!req.session.loggedIn;
}