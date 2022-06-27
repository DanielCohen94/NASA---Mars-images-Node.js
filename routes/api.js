let express = require('express');
let router = express.Router();
const apiController = require('../controllers/api');

// route to Registration ends - checks cookies that have not passed a minute
router.post('/api/confirmRegister', apiController.saveDetails)
// route to validate if email exist in db users
router.post('/api/email', apiController.emailExist)
// route to get Nasa page
router.post('/nasa', apiController.logInToNasa);
// route to add new image to user
router.put('/api/addImg', apiController.addImgByEmail);
// route to get all images of specific user
router.post('/api/gatAll', apiController.getAllImgByEmail);
// route to delete all images of specific user
router.delete('/api/deleteAll', apiController.deleteAll);
// route to delete all image of specific user
router.delete('/api/deleteItem', apiController.deleteItem);

module.exports = router;
