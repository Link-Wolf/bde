import { Injectable } from '@nestjs/common';
const { google } = require('googleapis');
const sheets = google.sheets('v4');
import { authenticate } from '@google-cloud/local-auth'
const fs = require('fs').promises;
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

@Injectable()
export class GoogleService {
	async  getStock() {
		const authClient = await this.authorize();
		const request = {
			// The ID of the spreadsheet to retrieve data from.
			spreadsheetId: '1xSMebaa5ELKAw_XaO02GoM1YFBok0t0yhlXj8nEkZlE',  // TODO: Update placeholder value.

			// The A1 notation of the values to retrieve.
			range: 'Inventaire!D5:D17',  // TODO: Update placeholder value.

			// How values should be represented in the output.
			// The default render option is ValueRenderOption.FORMATTED_VALUE.
			valueRenderOption: '',  // TODO: Update placeholder value.

			// How dates, times, and durations should be represented in the output.
			// This is ignored if value_render_option is
			// FORMATTED_VALUE.
			// The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
			dateTimeRenderOption: '',  // TODO: Update placeholder value.

			auth: authClient,
		};

		try {
			const response = (await sheets.spreadsheets.values.get(request)).data;
			console.log(JSON.stringify(response, null, 2));//TODO: return object
		} catch (err) {
			console.error(err);
		}
	}

	async loadSavedCredentialsIfExist() {
		try {
			const content = await fs.readFile(TOKEN_PATH);
			const credentials = JSON.parse(content);
			return google.auth.fromJSON(credentials);
		} catch (err) {
			return null;
		}
	}

	async saveCredentials(client: any) {
		const content = await fs.readFile(CREDENTIALS_PATH);
		const keys = JSON.parse(content);
		const key = keys.installed || keys.web;
		const payload = JSON.stringify({
			type: 'authorized_user',
			client_id: key.client_id,
			client_secret: key.client_secret,
			refresh_token: client.credentials.refresh_token,
		});
		await fs.writeFile(TOKEN_PATH, payload);
	}

	async authorize() {
		let client = await this.loadSavedCredentialsIfExist();
		if (client) {
			return client;
		}
		client = await authenticate({
			scopes: SCOPES,
			keyfilePath: CREDENTIALS_PATH,
		});
		if (client.credentials) {
			await this.saveCredentials(client);
		}
		return client;
	}
}
