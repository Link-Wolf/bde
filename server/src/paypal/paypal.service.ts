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


	// create an order
	async  createOrder(login) {
		const purchaseAmount = "100.00"; // TODO: pull amount from a database or session
		const accessToken = await this.generateAccessToken(login);
		const url = `${process.env.PAYPAL_BASE}/v2/checkout/orders`;
		const response = await axios(url, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			data: JSON.stringify({
				intent: "CAPTURE",
				purchase_units: [
					{
						amount: {
							currency_code: "USD",
							value: purchaseAmount
						},
					},
				],
			}),
		});
		const data = await response.data();
		return data;
	}

	// capture payment for an order
	async  capturePayment(orderId, login) {
		const accessToken = await this.generateAccessToken(login);
		const url = `${process.env.PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`;
		const response = await axios(url, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const data = await response.data();
		return data;
	}


}
