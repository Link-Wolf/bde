import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContributionModule } from './contribution/contribution.module';
import { Contribution } from './entity/Contribution';
import { Goodies } from './entity/Goodies';
import { Event } from './entity/Event';
import { Stud } from './entity/Stud';
import { StudModule } from './stud/stud.module';
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
import * as redisStore from 'cache-manager-redis-store';
import { Order } from './entity/Order';
import { Inscription } from './entity/Inscription';
import { GoogleModule } from './google/google.module';
const { _dbpw, _rdpw, host } = require('../config.json')


@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			port: 5432,
			host: process.env.PWD === "/server/app" ? host.docker.postgres : host.local.postgres,
			username: 'linkar',
			password: _dbpw,
			database: 'bde',
			entities: [Stud, Contribution, Event, Logs, Goodies, Order, Inscription],
			synchronize: true
		}),
		ConfigModule.forRoot({
			isGlobal: true
		}),
		StudModule,
		ContributionModule,
		EventModule,
		GoodiesModule,
		InscriptionModule,
		LogsModule,
		LoggerModule,
		AuthModule,
		PaypalModule,
		OrderModule,
		// CacheModule.register({
		// 	isGlobal: true,
		// 	store: redisStore,
		// 	host: process.env.PWD === "/server/app" ? host.docker.redis : host.local.redis,
		// 	port: "6379",
		// 	password: _rdpw
		// }),
		GoogleModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		// {
		// provide: APP_GUARD,
		// useClass: JwtAuthGuard,
		// },
	],
})
export class AppModule { }
