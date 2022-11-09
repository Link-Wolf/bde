import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { LoggerModule } from '../logger/logger.module';
import { HttpModule } from '@nestjs/axios';


@Module({
	imports: [LoggerModule, HttpModule],
	providers: [PaypalService],
	controllers: [PaypalController]
})
export class PaypalModule { }
