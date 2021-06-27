const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/authRouter');
const db = require('./config/db-setup');

const app = express();

app.use(express.json());



app.use(authRoutes);

app.use((req, res, next) => {
	res.json({ message: 'Welcome to Oauth server of Armenian Edward' });
});



app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  if (!statusCode) statusCode = 500;
  res.status(statusCode).json({ message });
});

db.initDb((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('connected to mongoDb');
		app.listen(3999, () => {
			console.log('running on port 3999');
		});
	}
});
