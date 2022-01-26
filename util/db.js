import { MongoClient } from 'mongodb';

export function connectToDatabase() {
	return MongoClient.connect(
		'mongodb+srv://admin_node:KvAZASexW7Tiejjr@cluster0.n1veg.mongodb.net/next?retryWrites=true&w=majority'
	);
}
