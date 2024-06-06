import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST({ request }) {
	const { token } = await request.json();
	try {
		jwt.verify(token, JWT_SECRET);
		return json({ authenticated: true });
	} catch (err) {
		return json({ authenticated: false, message: 'Invalid token' });
	}
}
