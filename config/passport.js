const LocalStrategy = require('passport-local');

const User = require('../app/models/user');

module.exports = function(passport) {

  // =========================================
  // SESSION SETUP ===========================
  // =========================================
  // required for presistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

  // =========================================
  // LOCAL SIGNUP ============================
  // =========================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was none, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses usernameand password
    // we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back entire request to the callback
  },
  function(req, email, password, done) {

    // async
    // User.findOne won't fire unless data is sent back
    process.nextTick(function() {

      // find a user whose email is the same as form's email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email': email }, function(err, user) {
        // if there are any errors, return the error
        if (err) {
          return done(err);
        }

        // check to see if there's already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if there is no user with that email
          // create the user
          const newUser = new User();

          //set the user's local credentails
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    })
  }

))
