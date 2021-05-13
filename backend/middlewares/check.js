module.exports = {
    checkUserLogin: function checkUserLogin(req, res, next) {
        if (!req.session.username) {
            return res.send({loggedIn:false});
        }
        next();
    },
    checkAdminLogin: function checkAdminLogin(req, res, next) {
        if (!req.session.adminname) {
            return res.send({loggedIn:false});
        }
        next();
    },
}