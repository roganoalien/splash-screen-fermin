const utils = {};

utils.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', '¡Necesitas iniciar sesión para acceder!');
        res.redirect('/administrador/login');
    }
};

module.exports = utils;
