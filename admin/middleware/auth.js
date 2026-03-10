// Protect routes — redirect to login if not logged in
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.admin) {
        return next();
    }
    res.redirect('/login');
};

module.exports = { isAuthenticated };