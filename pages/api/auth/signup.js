import { hashPassword } from '../../../util/auth';
import { connectToDatabase } from '../../../util/db';

async function handler(req, res) {
	if (req.method !== 'POST') {
		return;
	}

	const { image, email, password } = req.body;

	if (
		!image ||
		!email ||
		!email.includes('@') ||
		!password ||
		password.trim().length < 6
	) {
		return res.status(422).json({ message: 'Missing information. ' });
	}

	const client = await connectToDatabase();

	const db = client.db();

	const existingUser = await db.collection('users').findOne({ email: email });

	if (existingUser) {
		client.close();
		return res.status(422).json({ message: 'User already exists! ' });
	}

	const hashedPassword = await hashPassword(password);

	const user = await db.collection('users').insertOne({
		email: email,
		password: hashedPassword,
		image: image
	});

	client.close();
	return res
		.status(201)
		.json({ message: 'User created.', userId: user.insertedId });
}

export default handler;
