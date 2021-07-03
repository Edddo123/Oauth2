import { getDb } from '../config/db-setup';
// import {catchError, throwError} from '../utils/errorHandling';

export default class User {
	constructor(private email: string, private password: string, private fullName: string) {}

	async addUser(): Promise<Array<string | null>> {
		try {
			await getDb().db().collection('users').insertOne({
				email: this.email,
				password: this.password,
				fullName: this.fullName,
				createdAt: new Date(),
			});
			return ['success', null];
		} catch (error) {
			console.log(error);
			return [null, error];
		}
	}

	static async findUserByEmail(email: string): Promise<Array<string | null>> {
		try {
			const user = await getDb().db().collection('users').findOne({ email: email });
			return [user, null];
		} catch (error) {
			return [error, null];
		}
	}
}
