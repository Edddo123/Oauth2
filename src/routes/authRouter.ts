import express from 'express';
const router = express.Router();
// const isAuth = require('../middlewares/isAuth');

import { authorizeCode, signUp, createApplication, sendCode, sendToken } from '../controllers/authController';

router.get('/auth', authorizeCode);

router.post('/user', signUp);

router.post('/application', createApplication);

router.post('/code', sendCode);

router.post('/token', sendToken);

export default router;
