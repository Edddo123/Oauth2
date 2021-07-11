"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var authRouter_1 = __importDefault(require("./routes/authRouter"));
var db_setup_1 = require("./config/db-setup");
var isAuth_1 = require("./middlewares/isAuth");
var path_1 = __importDefault(require("path"));
var app = express_1.default();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
console.log(__dirname);
app.set('views', path_1.default.join(__dirname, '..', 'views'));
app.use(authRouter_1.default);
app.use(isAuth_1.isAuth, function (req, res, next) {
    res.json({ message: 'Welcome to Oauth server of Armenian Edward' });
});
app.use(function (err, req, res, next) {
    var statusCode = err.statusCode, message = err.message;
    if (!message)
        message = 'შეცდომა სერვერზე';
    if (!statusCode)
        statusCode = 500;
    return res.status(statusCode).json({ message: message });
});
db_setup_1.initDb(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('connected to mongoDb');
        app.listen(3999, function () {
            console.log('running on port 3999');
        });
    }
});
