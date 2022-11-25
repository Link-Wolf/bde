import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContributionModule } from './contribution/contribution.module';
import { Contribution } from './entity/Contribution';
import { Goodies } from './entity/Goodies';
import { Event } from './entity/Event';
import { Stud } from './entity/Stud';
import { Club } from './entity/Club';
import { StudModule } from './stud/stud.module';
import { ClubModule } from './club/club.module';
import { EventModule } from './event/event.module';
import { InscriptionModule } from './inscription/inscription.module';
import { LoggerModule } from './logger/logger.module';
import { LogsModule } from './logs/logs.module';
import { Logs } from './entity/Logs';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GoodiesModule } from './goodies/goodies.module';
//import { JwtAuthGuard } from './auth/jwtAuth.guard';
//import { APP_GUARD } from '@nestjs/core';
import { PaypalModule } from './paypal/paypal.module';
import { OrderModule } from './order/order.module';
import { Order } from './entity/Order';
import { Inscription } from './entity/Inscription';
import { GoogleModule } from './google/google.module';
import { CounterModule } from './counter/counter.module';
import { Counter } from './entity/Conter';


@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env'],
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			port: +process.env.POSTGRES_PORT,
			host: process.env.POSTGRES_HOST,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [
				Stud,
				Contribution,
				Event,
				Logs,
				Goodies,
				Club,
				Order,
				Inscription,
				Counter
			],
			synchronize: true
		}),
		StudModule,
		ClubModule,
		ContributionModule,
		EventModule,
		GoodiesModule,
		InscriptionModule,
		LogsModule,
		LoggerModule,
		AuthModule,
		PaypalModule,
		OrderModule,
		GoogleModule,
		CounterModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
	],
})
export class AppModule { }
