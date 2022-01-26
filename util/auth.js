import bcrypt from 'bcrypt';

export function hashPassword(password) {
	return bcrypt.hash(password, 12);
}

export async function verifyPassword(hashPassword, password) {
	return bcrypt.compare(password, hashPassword);
}
