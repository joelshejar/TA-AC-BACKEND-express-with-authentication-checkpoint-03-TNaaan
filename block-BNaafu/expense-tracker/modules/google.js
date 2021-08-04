let passport = require('passport');
let GoogleStrategy = require('passport-google-oauth20');
const User = require('../model/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      let googleUser = {
        name: profile._json.name,
        email: profile._json.email,
      };

      User.findOne({ email: profile._json.email }, (error, user) => {
        if (error) {
          return done(error);
        } else {
          if (user) {
            return done(null, user);
          } else {
            User.create(googleUser, (error, createdUser) => {
              if (error) {
                return done(error);
              } else {
                return done(null, createdUser);
              }
            });
          }
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => {
    if (error) {
      return done(error);
    } else {
      return done(null, user);
    }
  });
});