import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContributionModule } from './contribution/contribution.module';
import { Contribution } from './entity/Contribution';
import { Event } from './entity/Event';
import { Stud } from './entity/Stud';
import { StudModule } from './stud/stud.module';
import { EventModule } from './event/event.module';
import { InscriptionModule } from './inscription/inscription.module';
import { LoggerModule } from './logger/logger.module';
import { Log } from './entity/Log';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwtAuth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'linkar',
			password: 'xeno1et2',
			database: 'bde',
			entities: [Stud, Contribution, Event, Log],
			synchronize: true
		}),
		ConfigModule.forRoot({
			isGlobal: true
		}),
		StudModule,
		ContributionModule,
		EventModule,
		InscriptionModule,
		LoggerModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule { }
