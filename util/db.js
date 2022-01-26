import { MongoClient } from 'mongodb';

export function connectToDatabase() {
	return MongoClient.connect(process.env.MONGO_URI);
}
