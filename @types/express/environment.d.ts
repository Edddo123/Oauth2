declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
			PORT?: number;
			DB_NAME: string;
			LOCALHOST: string;
			SECRET_KEY: string;
		}
	}
	namespace Express {
		interface Request {
			userId: string;
		}
	}
}

//I get autofill support from here on process.env
export {};
