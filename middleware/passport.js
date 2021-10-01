
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models');
const constants = require('../util/constants');

module.exports = function () {
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    models.User.findByPk(id).then(
      (user) => {
        done(null, user);
      },
      (err) => {
        done(null, user);
      });
  });

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    (req, email, password, done) => {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      //process.nextTick(() => {
      models.SiteConfig.findOne({
        where: { 'config_key': constants.dbConfigKeys.ALLOW_SIGNUPS }
      })
        .then(
          (siteConfig) => {
            if (!siteConfig || siteConfig.config_value !== 'true') {
              return done(null, false, req.flash('signupMessage',
                'Signups are disabled at this time.'));
            } else {
              models.User.findOne({
                where: { 'email': email }
              })
                .then(
                  (user) => {
                    // check to see if theres already a user with that email
                    if (user) {
                      return done(null, false, req.flash('signupMessage',
                        'That email is already taken.'));
                    } else {
                      // if there is no user with that email
                      // create the user
                      models.User.create({
                        email: email,
                        password: models.User.generateHash(password)
                      }).then((newUser) => {
                        newUser
                          .save()
                          .then(() => done(null, newUser),
                            (err) => { throw err; });
                      });
                    }

                  },
                  (err) => done(err)
                );
            }
          },
          (err) => {
            return done(null, false, req.flash('signupMessage',
              'Signups are disabled at this time.'));
          }
        );
    }));


  // Missing email and password, it will never get here. Unknown reasons.
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    (req, email, password, done) => {
      models.User.findOne({ where: { 'email': email } })
        .then(
          (user) => {
            if (!user || !user.validPassword(password)) {
              return done(null, false, req.flash('loginMessage', 'Bad login.'));
            }

            return done(null, user);
          },
          (err) => {
            return done(null, false, req.flash('loginMessage', 'Login error.'));
          }
        );
    }));
};