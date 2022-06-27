let express = require('express');
let router = express.Router();
const usersController = require('../controllers/navigation');

// route to get login page
router.get('/', usersController.goToLogIn)
// route to get password page
router.post('/password', usersController.password);
// route to get Register page
router.get('/register', usersController.goToRegister);
// route to do log out from nasa and get login page
router.get('/logOut', usersController.logOut);

// routes for page protection
router.get('/api/email', usersController.noPermissions)
router.get('/api/confirmRegister', usersController.noPermissions) ;
router.get('/api/nasa', usersController.noPermissions);
router.get('/api/addImg', usersController.noPermissions);
router.get('/api/deleteItem', usersController.noPermissions);
router.get('/api/gatAll', usersController.noPermissions);
router.get('/api/deleteAll', usersController.noPermissions);
router.get('/password', usersController.noPermissions);
router.get('/nasa', usersController.goToNasa);


module.exports = router;
