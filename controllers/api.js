const Cookies = require("cookies");
const keys = ['keyboard cat'];
const db = require('../models');

/**
 * check if sixty seconds have passed since the registration began and save data
 * @param req
 * @param res
 */
exports.saveDetails = (req, res) => {
    const cookies = Cookies(req, res, {keys: keys})
    const email = req.body.email;
    const password = req.body.pas_one;
    const firstName = cookies.get("firstName");
    const lastName = cookies.get("lastName");
    emailExist(req.body.email).then((answer) => {
        if (answer.length !== 0)
            res.render('login', {message: "this email is already exist "})
        else {
            if (((new Date().getTime() - cookies.get('time')) / 600) < 60) {
                {
                    db.Users.create({firstName, lastName, email, password})
                        .then(req.session.message = "you are registered", res.redirect("/"))
                        .catch((err) => {
                            console.log('***There was an error creating a contact', JSON.stringify(err))
                            return res.status(400).send(err)
                        })
                }
            } else
                res.redirect("/");
        }
    })
        .catch((err) => {
            console.log('***There was an error creating a contact', JSON.stringify(err))
            return res.status(400).send(err)
        })

};

/**
 * check if email exist
 * @param req
 * @param res
 */
exports.emailExist = (req, res) => {

    const cookies = new Cookies(req, res, {keys: keys})
    cookies.set('time', new Date().getTime());
    emailExist(req.body.email)
        .then((contacts) => res.send(contacts.length.toString()))
        .catch((err) => {
            console.log('There was an error querying contacts', JSON.stringify(err))
            return res.send(err)
        });
};

/**
 * log In To Nasa - find the email in db and transfers to NASA's website
 * @param req
 * @param res
 */
exports.logInToNasa = (req, res) => {
    db.Users.findOne({where: {email: req.body.email, password: req.body.password}})
        .then((contacts) => {
                if (contacts !== null) {
                    contacts.dataValues.password = undefined;
                    req.session.user = contacts.dataValues;
                    res.locals.user = req.session.user;
                    res.redirect('/nasa');
                } else {
                    req.session.message = "Invalid email or password";
                    res.redirect("/");
                }
            }
        )
        .catch((err) => {
            console.log('There was an error querying contacts log int', JSON.stringify(err))
            return res.send(err)
        });
};

/**
 * Add image to db - To the email of a specific user
 * @param req
 * @param res
 */
exports.addImgByEmail = (req, res) => {
    const email = req.session.user.email;
    const {id_img, mission, camera, earth_date, sol, url} = req.body.element;

    db.MarsImage.findAll({where: {email: email, id_img: id_img}})
        .then((answer) => {
            if (answer.length !== 0)
                res.send(JSON.stringify({answer: [], status: false}))
            else {
                db.MarsImage.create({url, sol, earth_date, email, camera, id_img, mission})
                    .then(() => getAllImg(req.session.user.email).then((contacts) => {
                            res.send(JSON.stringify({answer: contacts, status: true}));
                        })
                    )
                    .catch((err) => {
                        console.log('***There was an error creating a contact', JSON.stringify(err))
                        return res.status(400).send(err)
                    })
            }
        })
};

/**
 * Returns all photos of a specific email
 * @param req
 * @param res
 */
exports.getAllImgByEmail = (req, res) => {

    getAllImg(req.session.user.email).then((contacts) => {
        res.send(JSON.stringify({answer: contacts}));
    }).catch((err) => {
        console.log('There was an error querying contacts get all', JSON.stringify(err))
        return res.send(err)
    });
};

/**
 * Delete all photos of a specific email
 * @param req
 * @param res
 */
exports.deleteAll = (req, res) => {

    db.MarsImage.destroy({where: {email: req.session.user.email}})
        .then(() => res.send({answer: []}))
        .catch((err) => {
            console.log('There was an error querying contacts', JSON.stringify(err))
            return res.send(err)
        });
};

/**
 * Delete one photos of a specific email
 * @param req
 * @param res
 */
exports.deleteItem = (req, res) => {
    db.MarsImage.destroy({where: {email: req.session.user.email, id_img: req.body.element.id_img}})
        .then(() => getAllImg(req.session.user.email).then((contacts) => {
            res.send(JSON.stringify({answer: contacts}));
        }))
        .catch((err) => {
            console.log('There was an error querying contacts', JSON.stringify(err))
            return res.send(err)
        });
};

/**
 * Searches for all photos for a specific email and returns a promise
 * @param email
 * @returns {Promise<[]>}
 */
getAllImg = function (email) {
    return db.MarsImage.findAll({where: {email: email}});
}

/**
 * Finds if a specific email already exists and returns a promise
 * @param email
 * @returns {Promise<[]>}
 */
emailExist = function (email) {
    return db.Users.findAll({where: {email: email}});
}

