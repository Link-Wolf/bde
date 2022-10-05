import { Controller, Get } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
	constructor(private googleService: GoogleService) { }

	@Get()
	findAll() {
		return this.googleService.getStock();
	}
}
