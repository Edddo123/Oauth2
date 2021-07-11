"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
// const isAuth = require('../middlewares/isAuth');
var authController_1 = require("../controllers/authController");
router.get('/auth', authController_1.authorizeCode);
router.post('/user', authController_1.signUp);
router.post('/application', authController_1.createApplication);
router.post('/code', authController_1.sendCode);
router.post('/token', authController_1.sendToken);
exports.default = router;
