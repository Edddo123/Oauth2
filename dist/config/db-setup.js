"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.initDb = void 0;
var mongodb_1 = __importDefault(require("mongodb"));
var dotenv_1 = __importDefault(require("dotenv"));
// dotenv.config({
//   path: path.join(path.dirname(require.main!.filename), "../.env"),
// });
dotenv_1.default.config();
var MongoClient = mongodb_1.default.MongoClient;
var host = process.env.LOCALHOST;
var dbName = process.env.DB_NAME;
var mongoDbUrl = "mongodb://" + host + "/" + dbName + "?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
var _db;
// export interface ClientStructure {
//   _id?: string;
//   email: string;
//   password: string;
//   phone: string;
//   personalId: string;
// }
var initDb = function (callback) {
    if (_db) {
        console.log("Database is already initialized!");
        return callback(null, _db);
    }
    MongoClient.connect(mongoDbUrl, { useUnifiedTopology: true })
        .then(function (client) {
        _db = client;
        callback(null, _db);
    })
        .catch(function (err) {
        callback(err);
    });
};
exports.initDb = initDb;
var getDb = function () {
    if (!_db) {
        throw Error("Database not initialzed");
    }
    return _db;
};
exports.getDb = getDb;
