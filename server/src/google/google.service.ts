import { Injectable } from '@nestjs/common';
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { authenticate } = require('@google-cloud/local-auth');
const { google_api } = require('../config.json')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];


@Injectable()
export class GoogleService {// BEFORE RUNNING:
	// ---------------
	// 1. If not already done, enable the Google Sheets API
	//    and check the quota for your project at
	//    https://console.developers.google.com/apis/api/sheets
	// 2. Install the Node.js client library by running
	//    `npm install googleapis --save`

	async  getStock() {
		const authClient = await google.auth.fromJSON(google_api.creds);
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
			// TODO: Change code below to process the `response` object:
			console.log(JSON.stringify(response, null, 2));
		} catch (err) {
			console.error(err);
		}
	}

	async authorize() {
		// TODO: Change placeholder below to generate authentication credentials. See
		// https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
		//
		// Authorize using one of the following scopes:
		//   'https://www.googleapis.com/auth/drive'
		//   'https://www.googleapis.com/auth/drive.file'
		//   'https://www.googleapis.com/auth/drive.readonly'
		//   'https://www.googleapis.com/auth/spreadsheets'
		//   'https://www.googleapis.com/auth/spreadsheets.readonly'
		let authClient = await google.auth.fromJSON(google_api.creds);
		if (authClient) {
			return authClient;
		}
		authClient = await authenticate({
			scopes: SCOPES,
			keyfilePath: CREDENTIALS_PATH,
		});
		if (authClient.credentials) {
			await saveCredentials(authClient);
		}
		return authClient;



		if (authClient == null) {
			throw Error('authentication failed');
		}

		return authClient;
	}
}
