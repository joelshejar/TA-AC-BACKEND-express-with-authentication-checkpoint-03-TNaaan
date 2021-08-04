let User = require('../models/User')

module.exports = {
    loggedInUser:(req, res, next)=> {
        if(req.session && req.session.userId) {
            next()
        }else if(req.session && req.session.passport){
           next()
        }else{
            console.log("auth")
            res.redirect('/users/login')
        }
    },
    userInfo: (req, res, next)=> {
        var userId = req.session && req.session.userId;
        var userpassport = req.session && req.session.passport;
        if(userId) {
            User.findById(userId ,"name email" ,  (err , user)=> {
                if(err) next(err)
                if (!req.session.passport) {
                    req.user = user;
                }
                res.locals.user = user;
                next();
            })
        }else if(userpassport) {
            User.findById(userpassport.user ,  (err , user)=> {
                if(err) next(err)
                res.locals.user = user;
                next();
            })
        }
        else{
            req.user = null;
            res.locals.user = null;
            next();
        }
    }
}
