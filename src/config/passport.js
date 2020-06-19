import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';

import User from '../models/user';

export default function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new Strategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, login, password, done) => {
        User.findOne({ login }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (user) {
                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) {
                        return done(err)
                    }
                    if (!isValid) {
                        return done(null, false);
                    }
                    return done(null, user)
                });
            } else {
                return done(null, false);
            }
        });
    }));
}