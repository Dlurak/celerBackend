const LocalStrategy = require('passport-local').Strategy;
const database = require('./database');

function initialize(passport) {
    const authenticateUser = (username, password, done) => {
        const user = database.checkPasswordUsernameCombination(username, password);
        if (user == null) {
            return done(null, false, { message: 'The Combination of the username and the password doesn\'t exist' });
        } else {
            return done(null, user);
        }
    };

    passport.use(
        new LocalStrategy({ usernameField: 'username' },
        authenticateUser
    ));
    passport.serializeUser((user, done) => done(null, user.username));
    passport.deserializeUser((username, done) => {
        return done(null, database.findUser(username));
    });
}

module.exports = initialize;