// schema of a user collection

db.runCommand({
	collMod: 'users',
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			required: ['email', 'password', 'fullName', 'createdAt'],
			properties: {
				email: {
					bsonType: 'string',
					description: 'must be a string',
				},
				password: {
					bsonType: 'string',
					description: 'must be a string',
				},
				fullName: {
					bsonType: 'string',
					description: 'must be a string',
				},
				createdAt: {
					bsonType: 'date',
					description: 'must be a date',
				},
				applications: {
					bsonType: 'array',
					description: 'must be a array',
					items: {
						bsonType: 'object',
						required: ['appName', 'clientId', 'clientSecret', 'redirectUri'],
						properties: {
							appName: {
								bsonType: 'string',
								description: 'must be a string',
							},
							clientId: {
								bsonType: 'string',
								description: 'must be a string',
							},
							clientSecret: {
								bsonType: 'string',
								description: 'must be a string',
							},
							redirectUri: {
								bsonType: 'array',
								description: 'must be a array',
								items: {
									bsonType: 'string',
									description: 'must be a string',
								},
							},
						},
					},
				},
			},
		},
	},
});

// required: ['appName', 'clientId', 'clientSecret, redirectUri'],

db.users.insertOne({
	email: 'asdad',
	password: 'asda',
	fullName: 'asda',
	createdAt: { $currentDate: { createdAt: { $type: 'timestamp' } } },
});

db.users.updateOne(
	{ _id: ObjectId('60d899a5673e50057c6b2943') },
	{
		$set: {
			applications: [
				{
					clientId: '34a51a5bba54434bc7fbb5017a4baf',
					clientSecret: 'e93b6d4d71199bb32a7a3d65887e58',
					appName: 'Main App',
					redirectUri: ['http://localhost:4001/auth/redirect'],
				},
			],
		},
	}
);

db.users.updateOne(
	{ _id: ObjectId('60d899a5673e50057c6b2943') },
	{
		$push: {
			applications: {
				clientId: '34a51a5bba54434bc7fbb5017a4baf',
				clientSecret: 'e93b6d4d71199bb32a7a3d65887e58',
				appName: 'Main App',
				redirectUri: ['http://localhost:4001/auth/redirect'],
			},
		},
	}
);

// db.users.findOne({applications: {$all: [ {$elemMatch: {appName: "Main app"}}]}})
// db.users.find({"applications.appName": "appN1"}, {_id: 0, applications: {$elemMatch: {appname: "appN1"}}}) elem match should work as well

// db.users.find({"applications.appName": "appN1"}, {_id: 1, "applications.$": 1}).pretty() $ - it uses query condition and returns first matching element, in elemMatch u specify condition yourself

//, redirectUri: {$all: ["http://localhost:4001/auth/redirect"]}