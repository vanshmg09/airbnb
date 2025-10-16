module.exports.isLoggedIn = (req, res, next) => {
    // redirectUrl save
    req.session.redirectUrl = req.originalUrl;
    // console.log(req.path ,"..", req.originalUrl );
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};