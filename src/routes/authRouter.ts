import express from 'express';
const router = express.Router();
// const isAuth = require('../middlewares/isAuth');

import { authorizeCode, signUp, createApplication } from '../controllers/authController';

router.get('/auth', authorizeCode);

router.post('/user', signUp);

router.post('/application', createApplication);

export default router;
