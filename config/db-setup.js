const mongodb = require('mongodb');

//mongo db connect using connection pooling by default so we use same connection if its open
//also we would create indexes still from shell and after adding index we dont even need to restart mongo server or node server
//also to keep users from using same email we could add unique index on email field and thats it.
var crypto = require("crypto");

const MongoClient = mongodb.MongoClient;
const host = process.env.LOCALHOST
const dbName = process.env.DB_NAME
var id = crypto.randomBytes(15).toString('hex');
console.log(id)
const mongoDbUrl = `mongodb://${host}/${dbName}?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;

let _db;

const initDb = (callback) => {
	if (_db) {
		console.log('Database is already initialized!');
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

const getDb = () => {
	if (!_db) {
		throw Error('Database not initialzed');
	}
	return _db;
};

module.exports = {
	initDb,
	getDb,
};
