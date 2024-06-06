import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST({ request }) {
	const { token } = await request.json();
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const currentTime = Math.floor(Date.now() / 1000);
		const timeRemaining = decoded.exp - currentTime;

		// Format timeRemaining to a human-readable format
		const hours = Math.floor(timeRemaining / 3600);
		const minutes = Math.floor((timeRemaining % 3600) / 60);
		const seconds = timeRemaining % 60;

		return json({
			authenticated: true,
			timeRemaining: `${hours}h ${minutes}m ${seconds}s`
		});
	} catch (err) {
		return json({ authenticated: false, message: 'Invalid token' });
	}
}
