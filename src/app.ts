import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRouter';
import { initDb } from './config/db-setup';
import { Express, Request, Response, NextFunction } from 'express';
import { ErrorObject } from './utils/errorHandling';
import { isAuth } from './middlewares/isAuth';

const app: Express = express();
dotenv.config();

app.use(express.json());

app.use(authRoutes);

app.use(isAuth, (req, res, next) => {
	res.json({ message: 'Welcome to Oauth server of Armenian Edward' });
});

app.use((err: ErrorObject, req: Request, res: Response, next: NextFunction): any => {
	let { statusCode, message } = err;
	if (!message) message = 'შეცდომა სერვერზე';
	if (!statusCode) statusCode = 500;
	return res.status(statusCode).json({ message });
});

initDb((err: Record<string, unknown>) => {
	if (err) {
		console.log(err);
	} else {
		console.log('connected to mongoDb');
		app.listen(3999, () => {
			console.log('running on port 3999');
		});
	}
});
