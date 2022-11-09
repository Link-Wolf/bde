import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PaypalService {
	constructor(
		private readonly logger: LoggerService,
		private httpService: HttpService
	) { };

	async generateClientToken(login: string) {
		try {

			// const accessToken = await this.generateAccessToken(login);
			// const response = this.httpService.post(`${process.env.PAYPAL_BASE}/v1/identity/generate-token`, {
			// 	headers: {
			// 		Authorization: `Bearer ${accessToken}`,
			// 		"Accept-Language": "en_US",
			// 		"Content-Type": "application/json",
			// 	},
			// });
			// this.logger.log("Generated paypal client token", login)
			// return response.data.client_token;
		} catch (err) {
			this.logger.warn(`Failed -> generate paypal client token (certainly not a real problem t r u s t) : ${err}`, login)
			throw err;

		}
	}

	async generateAccessToken(login: string) {
		try {
			// const auth = Buffer
			// 	.from(process.env.PAYPAL_ID + ":" + process.env.PAYPAL_SECRET)
			// 	.toString("base64");
			// const response = this.httpService.post(`${process.env.PAYPAL_BASE}/v1/oauth2/token`, {
			// 	data: "grant_type=client_credentials",
			// 	headers: {
			// 		Authorization: `Basic ${auth}`,
			// 		Accept: "application/json",
			// 		Content: "x-www-form-urlencoded"
			// 	},
			// });
			// this.logger.log("Generated paypal access token", login)
			// return response.data.access_token;
		}
		catch (err) {
			this.logger.warn(`Failed -> generate paypal access token (certainly not a real problem t r u s t) : ${err}`, login)
			throw err;

		}
	}
}
