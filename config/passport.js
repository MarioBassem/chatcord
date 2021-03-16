const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/Users');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({ where: {
        email: email
      }}).then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect credentials' });
        }
        // Match password
        bcrypt.compare(password, user.hashed_password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect credentials' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findByPk(id).then(user => {
        done(null, user);
    }).catch(err => {
        done(err, false);
    })
  });
};