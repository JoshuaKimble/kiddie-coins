import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function getCurrentPin(localTime) {
	const now = new Date(localTime);
	const mm = String(now.getMonth() + 1).padStart(2, '0');
	const dd = String(now.getDate()).padStart(2, '0');
	const yy = String(now.getFullYear()).slice(-2);
	return mm + dd + yy;
}

export async function POST({ request }) {
	const { pin, userLocalTime } = await request.json();
	const todayPin = getCurrentPin(userLocalTime);
	const authenticated = pin === todayPin;

	if (authenticated) {
		const token = jwt.sign({ pin }, JWT_SECRET, { expiresIn: '15m' });
		return json({
			token,
			message: 'Login successful'
		});
	} else {
		return json(
			{
				message: 'Login failed'
			},
			{ status: 401 }
		);
	}
}
