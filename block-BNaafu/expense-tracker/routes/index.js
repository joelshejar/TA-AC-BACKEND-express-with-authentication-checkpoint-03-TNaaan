var express = require('express');
var router = express.Router();
let User = require('../model/user');
let Income = require('../model/income');
let Expense = require('../model/expense');
let passport = require('passport');
let auth = require('../middleware/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/register', (req, res) => {
  res.render('registerUser');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (error, user) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/login');
    }
  });
});

router.get('/login', (req, res) => {
  res.render('loginUser');
});

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if (email && password) {
    User.findOne({ email }, (error, user) => {
      if (error) {
        next(error);
      } else {
        if (user) {
          user.verifyPassword(password, (error, result) => {
            if (error) {
              next(error);
            } else {
              if (result) {
                if (!user.isVerified) {
                  req.session.userId = user.id;
                  // console.log(req.session, result, user.isVerified);
                  res.redirect('/dashboard');
                } else {
                  res.send('Please verify your email before login');
                }
              } else {
                res.send('Password Incorrect');
              }
            }
          });
        } else {
          res.send('User not found');
        }
      }
    });
  } else {
    res.send('email or password is not present');
  }
});

router.get('/resetPassword', (req, res) => {
  res.render('resetPassword');
});

router.get('/failure', (req, res) => {
  res.send('Failed');
});

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect-sid');
  res.redirect('/login');
});

router.use(auth.loggedInUser);

router.get('/dashboard', (req, res, next) => {
  Income.find({}, (error, income) => {
    if (error) {
      next(error);
    } else {
      Expense.find({}, (error, expense) => {
        if (error) {
          next(error);
        } else {
          res.render('dashboard', { income: income, expense: expense });
        }
      });
    }
  });
});

router.get('/income', (req, res) => {
  res.render('income');
});

router.post('/income', (req, res) => {
  let userId = req.session.userId || req.session.passport.user;
  req.body.userId = userId;
  Income.create(req.body, (error, income) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/dashboard');
    }
  });
});

router.get('/expense', (req, res, next) => {
  res.render('expense');
});

router.post('/expense', (req, res, next) => {
  let userId = eq.session.userId || req.session.passport.user;
  req.body.userId = userId;
  Expense.create(req.body, (error, expense) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/dashboard');
    }
  });
});
module.exports = router;
