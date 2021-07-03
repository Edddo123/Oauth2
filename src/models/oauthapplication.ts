import { getDb } from '../config/db-setup';
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectID;

interface UpdateUser {
	modifiedCount: number;
}

export default class OauthApplication {
	constructor(
		private appName: string,
		private clientId: string,
		private clientSecret: string,
		private redirectUri: string
	) {}

	async addOauthApp(userId: string): Promise<Array<UpdateUser | null>> {
		try {
			const user: UpdateUser = await getDb()
				.db()
				.collection('users')
				.updateOne(
					{ _id: new ObjectId('60d899a5673e50057c6b2943') }, // here will go req.userId
					{
						$push: {
							applications: {
								appName: this.appName,
								redirectUri: this.redirectUri,
								clientSecret: this.clientSecret,
								clientId: this.clientId,
							},
						},
					}
				);
			return [user, null];
		} catch (error) {
			return [null, error];
		}
	}
}
