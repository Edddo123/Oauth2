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
					{ _id: new ObjectId('60ea2a354f24fa5d80a089fa') }, // here will go req.userId
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

	static async matchRedirectUrl(clientId: string, url: string): Promise<Array<string | null>> {
		try {
			const redirectUri = await getDb()
				.db()
				.collection('users')
				.findOne({ 'applications.clientId': clientId }, { projection: { 'applications.$': 1 } });
			if (!redirectUri) {
				const error = new Error('No client found');
				return [null, error.message];
			}
			if (redirectUri?.applications[0]?.redirectUri[0] !== url) {
				const error = new Error('redirect Url-s dont match');
				return [null, error.message];
			}
			return [redirectUri, null];
		} catch (error) {
			return [null, error];
		}
	}
}
