import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PaypalService {
	constructor(private readonly logger: LoggerService) { };

	async generateClientToken(login: string) {
		const accessToken = await this.generateAccessToken(login);
		const response = await axios(`${process.env.PAYPAL_BASE}/v1/identity/generate-token`, {
			method: "post",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Accept-Language": "en_US",
				"Content-Type": "application/json",
			},
		});
		console.log(response)
		return response.data.client_token;
	}

	async generateAccessToken(login: string) {
		const auth = Buffer.from(process.env.PAYPAL_ID + ":" + process.env.PAYPAL_SECRET).toString("base64");
		const response = await axios(`${process.env.PAYPAL_BASE}/v1/oauth2/token`, {
			method: "post",
			data: "grant_type=client_credentials",
			headers: {
				Authorization: `Basic ${auth}`,
			},
		});
		return response.data.access_token;
	}
}
