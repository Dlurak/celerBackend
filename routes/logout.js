const express = require('express');
const loggedInFn = require('../middleware/session');

const router = express.Router();


//  a route for the logout that requires the user to be logged in
router.get('/', (req, res) => {
    const loggedIn = loggedInFn(req);
    if (loggedIn) {
        req.session.destroy();
        res.status(200).json({ message: 'You are logged out' });
    } else {
        res.status(401).json({ error: 'You are not logged in' });
    }
});

module.exports = router;