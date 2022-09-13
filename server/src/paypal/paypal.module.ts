import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [LoggerModule],
	providers: [PaypalService],
	controllers: [PaypalController]
})
export class PaypalModule { }
