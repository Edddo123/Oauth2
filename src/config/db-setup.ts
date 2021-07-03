import mongodb from "mongodb";
import dotenv from "dotenv";
// dotenv.config({
//   path: path.join(path.dirname(require.main!.filename), "../.env"),
// });
dotenv.config();
const MongoClient = mongodb.MongoClient;

const host = process.env.LOCALHOST
const dbName = process.env.DB_NAME

const mongoDbUrl = `mongodb://${host}/${dbName}?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;

let _db: mongodb.MongoClient;

// export interface ClientStructure {
//   _id?: string;
//   email: string;
//   password: string;
//   phone: string;
//   personalId: string;
// }


export const initDb = (callback: any) => {
  if (_db) {
    console.log("Database is already initialized!");
    return callback(null, _db);
  }
  MongoClient.connect(mongoDbUrl, { useUnifiedTopology: true })
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

export const getDb = (): mongodb.MongoClient => {
  if (!_db) {
    throw Error("Database not initialzed");
  }
  return _db;
};
