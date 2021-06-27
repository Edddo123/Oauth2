const router = require('express').Router();
const isAuth = require('../middlewares/isAuth');

const { authorizeCode, signUp, createApplication } = require('../controllers/authController');

router.get('/auth', authorizeCode);

router.post('/user', signUp);

router.post('/application', createApplication);

module.exports = router;
