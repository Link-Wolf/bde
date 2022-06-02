import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscription } from '../dist/inscription/inscription.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContributionModule } from './contribution/contribution.module';
import { Contribution } from './entity/Contribution';
import { Event } from './entity/Event';
import { User } from './entity/User';
import { EventModule } from './event/event.module';
import { InscriptionModule } from './inscription/inscription.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 4343,
			username: 'root',
			password: 'root',
			database: 'bdedb',
			entities: [User, Contribution, Event, Inscription],
			synchronize: true
		}),
		ContributionModule,
		EventModule,
		InscriptionModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
