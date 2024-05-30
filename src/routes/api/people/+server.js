import { json, text } from '@sveltejs/kit';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

const auth = new google.auth.GoogleAuth({
	credentials: {
		client_email: process.env.AUTH_EMAIL,
		private_key: process.env.AUTH_KEY?.replace(/\\n/g, '\n')
	},
	scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const JWT_SECRET = process.env.JWT_SECRET;

function transformData(data) {
	const headers = data[0];
	const transformed = data.slice(1).map((row) => {
		const rowObject = row.reduce((obj, value, index) => {
			const header = headers[index];
			obj[header] = header === 'coins' ? parseInt(value, 10) : value;
			return obj;
		}, {});
		return rowObject;
	});
	return transformed;
}

export async function GET() {
	try {
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: process.env.SPREADSHEET_ID,
			range: 'Sheet1'
		});
		return json({
			data: transformData(response.data.values)
		});
	} catch (error) {
		return json({ message: 'Failed to fetch data from Google Sheets:', error }, { status: 500 });
	}
}

export async function POST({ request }) {
	const { SPREADSHEET_ID } = process.env;
	const reqJson = await request.json();

	const { name, coins } = reqJson;

	const authHeader = request.headers.get('Authorization');
	if (!authHeader) {
		return json({ message: 'No token provided' }, { status: 401 });
	}

	const token = authHeader.split(' ')[1];
	try {
		jwt.verify(token, JWT_SECRET);

		const findResponse = await sheets.spreadsheets.values.get({
			spreadsheetId: SPREADSHEET_ID,
			range: 'Sheet1'
		});

		const rows = findResponse.data.values;
		const rowIndex = rows.findIndex((row) => row[0] === name) + 1;

		if (rowIndex > 0) {
			sheets.spreadsheets.values.update({
				spreadsheetId: SPREADSHEET_ID,
				range: `Sheet1!B${rowIndex}`,
				valueInputOption: 'RAW',
				resource: {
					values: [[coins]]
				}
			});
			return json({
				body: { message: 'Update successful' },
				status: 200,
				coins
			});
		} else {
			return json({ message: 'Person not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Failed to update data in Google Sheets:', error);
		return json({ message: 'Failed to update data in Google Sheets:', error }, { status: 500 });
	}
}

export async function fallback({ request }) {
	return text(`I caught your ${request.method} request!`);
}
