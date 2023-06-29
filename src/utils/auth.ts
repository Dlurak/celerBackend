const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Creates a JWT token for a user that is valid for 1 hour
 * @param username The username of the user who is requesting a token
 * @returns A JWT token
 */
export function generateToken(username: string) {
    const payload = {
        username: username
    };

    const options = {
        expiresIn: '2m'
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
}
