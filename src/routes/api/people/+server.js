import { json, text } from '@sveltejs/kit';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
	credentials: {
		client_email: process.env.AUTH_EMAIL,
		private_key: process.env.AUTH_KEY?.replace(/\\n/g, '\n')
	},
	scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

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

	try {
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
				status: 200,
				body: { message: 'Update successful' }
			});
		} else {
			return json({ message: 'Person not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Failed to update data in Google Sheets:', error);
		return json({ message: 'Failed to update data in Google Sheets:', error }, { status: 500 });
	}
}

// This handler will respond to PUT, PATCH, DELETE, etc.
export async function fallback({ request }) {
	return text(`I caught your ${request.method} request!`);
}
