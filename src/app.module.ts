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

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'test',
			password: 'test',
			database: 'bde',
			entities: [Stud, Contribution, Event],
			synchronize: true
		}),
		StudModule,
		ContributionModule,
		EventModule,
		InscriptionModule,
		LoggerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
