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
import * as redisStore from 'cache-manager-redis-store';
const { db_password, session_secret } = require('../config.json')


@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.PSQL_HOST,
			port: parseInt(process.env.PSQL_PORT),
			username: 'linkar',
			password: db_password,
			database: 'bde',
			entities: [Stud, Contribution, Event, Logs, Goodies],
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
		CacheModule.register({
			isGlobal: true,
			store: redisStore,
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			password: session_secret
		}),
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
