let passport = require('passport');
let GithubStrategy = require('passport-github');
let User = require('../model/user');

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      let githubUser = {
        name: profile.displayName,
        username: profile._json.username,
        email: profile._json.email,
        photo: profile._json.avatar_url,
      };

      User.findOne({ email: profile._json.email }, (error, user) => {
        if (error) {
          return done(error);
        } else {
          if (user) {
            return done(null, user);
          } else {
            User.create(githubUser, (error, createdUser) => {
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