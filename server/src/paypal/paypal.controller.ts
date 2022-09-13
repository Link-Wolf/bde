import { Controller, Session, Get } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
	constructor(private paypalService: PaypalService) { }
	@Get('clientToken')
	generateClientToken(@Session() session: Record<string, any>) {
		return this.paypalService.generateClientToken(session.login);
	}
}
