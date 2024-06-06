import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Calculates the time remaining until a JWT token expires and formats it as HH:MM:SS.
 *
 * @param {Object} decoded - The decoded JWT token payload.
 * @param {number} decoded.exp - The expiration time of the token in seconds since the Unix epoch.
 * @returns {string} The formatted time remaining until the token expires, in the format HH:MM:SS.
 */
function getTimeRemaining(decoded) {
	const currentTime = Math.floor(Date.now() / 1000);
	const timeRemaining = decoded.exp - currentTime;
	const hours = Math.floor(timeRemaining / 3600)
		.toString()
		.padStart(2, '0');
	const minutes = Math.floor((timeRemaining % 3600) / 60)
		.toString()
		.padStart(2, '0');
	const seconds = (timeRemaining % 60).toString().padStart(2, '0');

	return `${hours}:${minutes}:${seconds}`;
}

export async function POST({ request }) {
	const { token } = await request.json();
	try {
		const decoded = jwt.verify(token, JWT_SECRET);

		return json({
			authenticated: true,
			timeRemaining: getTimeRemaining(decoded)
		});
	} catch (err) {
		return json({ authenticated: false, message: 'Invalid token' });
	}
}
