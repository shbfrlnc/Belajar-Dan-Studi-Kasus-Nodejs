module.exports.loggedInCheck = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect("/member");
    }
    next();
}

module.exports.authCheck = (roles) => {
    return (req, res, next) => {
        const testLoggedIn = req.session.isLoggedIn;

        if (testLoggedIn) {
            const testRole = req.session.user.role;
            if (roles.includes(testRole)) {
                next();
            } else {
                res.redirect('/member');
            }
        } else {
            res.redirect('/');
        }
    }
}