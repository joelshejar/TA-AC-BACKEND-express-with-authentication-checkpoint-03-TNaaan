module.exports = {
    loggedInUser: (req, res, next) => {
      // console.log(req.session);
      if (req.session && (req.session.userId || req.session.passport)) {
        next();
      } else {
        res.redirect('/login');
      }
    },
  };