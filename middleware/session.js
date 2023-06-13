function loggedIn(req) {
    return !!req.session.loggedIn;
}

module.exports = loggedIn