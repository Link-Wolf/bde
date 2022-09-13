import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LoggerService } from '../logger/logger.service';

const { PAYPAL_ID, PAYPAL_SECRET, PAYPAL_BASE } = process.env;

@Injectable()
export class PaypalService {
	constructor(private readonly logger: LoggerService) { };

	async generateClientToken(login: string) {
		const accessToken = await this.generateAccessToken(login);
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			"Accept-Language": "en_US",
			"Content-Type": "application/json",
		}
		const data = await axios.post(
			`${PAYPAL_BASE}/v1/identity/generate-token`,
			null, { headers }
		).then(response => { return response.data });
		// const data = await response.json();
		this.logger.log(`Successfully created a new paypal client token`, login)
		return data.client_token;
	}

	async generateAccessToken(login: string) {

		const auth = Buffer.from(PAYPAL_ID + ":" + PAYPAL_SECRET).toString("base64");
		const headers = {
			Authorization: `Basic ${auth}`,
		}
		const data = await axios.post(
			`${PAYPAL_BASE}/v1/oauth2/token`,
			"grant_type=client_credentials",
			{ headers }).then(response => { return response.data });;
		this.logger.log(`Successfully created a new paypal access token`, login)
		return data.access_token;

	}
}
