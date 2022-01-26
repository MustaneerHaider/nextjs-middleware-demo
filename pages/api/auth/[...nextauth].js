import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../util/auth';
import { connectToDatabase } from '../../../util/db';

export default NextAuth({
	providers: [
		CredentialsProvider({
			async authorize({ email, password }) {
				const client = await connectToDatabase();
				const db = client.db();

				const user = await db.collection('users').findOne({ email });

				if (!user) {
					client.close();
					throw new Error('Invalid email or password.');
				}

				const isEqual = await verifyPassword(user.password, password);

				if (!isEqual) {
					client.close();
					throw new Error('Invalid email or password.');
				}

				return {
					email: user.email,
					image: user.image
				};
			}
		})
	],
	session: {
		strategy: 'jwt'
	},
	secret: process.env.JWT_SECRET
});
