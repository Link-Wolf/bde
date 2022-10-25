import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ContributionModule } from '../contribution/contribution.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entity/Order';
import { LoggerModule } from '../logger/logger.module';
import { StudModule } from '../stud/stud.module';
import { InscriptionModule } from '../inscription/inscription.module';


@Module({
	imports: [
		ContributionModule,
		TypeOrmModule.forFeature([Order]),
		LoggerModule,
		StudModule,
		InscriptionModule],
	providers: [OrderService],
	controllers: [OrderController]
})
export class OrderModule { }
