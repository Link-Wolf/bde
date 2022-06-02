import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Contribution } from './contribution/contribution.entity';
import { ContributionModule } from './contribution/contribution.module';
import { Event } from './event/event.entity';
import { EventModule } from './event/event.module';
import { Inscription } from './inscription/inscription.entity';
import { InscriptionModule } from './inscription/inscription.module';
import { User } from './user/user.entity';

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
