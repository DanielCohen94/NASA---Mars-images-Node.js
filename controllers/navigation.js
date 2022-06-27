const Cookies = require("cookies");
const keys = ['keyboard cat'];

/**
 * Saves data in cookies and passes to the password entry page
 * @param req
 * @param res
 */
exports.password = (req, res) => {
    const cookies = Cookies(req, res, {keys: keys})
    const email = req.body.email;
    cookies.set("firstName", req.body.firstName);
    cookies.set("lastName", req.body.lastName);
    cookies.set("email", req.body.email);
    res.render('password', {email: email});
};

/**
 * Blocks access to protected pages
 Switch to NASA if there is an open session
 Goes to the login page if not
 * @param req
 * @param res
 */
exports.noPermissions = (req, res) => {

    if (!req.session.user) {
        res.locals.message = "";
        res.redirect("/");
    } else
        res.redirect("/nasa");

};

/**
 * Goes to the registration page if there is no open session
 otherwise leaves the user on NASA's site
 * @param req
 * @param res
 */
exports.goToRegister = (req, res) => {
    if (!req.session.user)
        res.render('register', {title: "register"});
    else
        res.redirect("/nasa");

};

/**
 * Disconnect from Nasa's page
 Deletes the session
 * @param req
 * @param res
 */
exports.logOut = (req, res) => {
    req.session.destroy();
    res.locals.message = "";
    res.redirect("/");

};

/**
 * Blocks access to protected pages
 Switch to NASA if there is an open session
 Goes to the login page if not
 * @param req
 * @param res
 */
exports.goToLogIn = (req, res) => {
    if (!req.session.user) {
        res.locals.message = req.session.message;
        req.session.message = "";
        res.render('logIn');
    } else
        res.redirect("/nasa");

};

exports.goToNasa = (req, res) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
        res.render("nasa");
    } else
        res.redirect("/");
};
