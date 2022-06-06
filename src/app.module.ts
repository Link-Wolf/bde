import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContributionModule } from './contribution/contribution.module';
import { Contribution } from './entity/Contribution';
import { Event } from './entity/Event';
import { User } from './entity/User';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { InscriptionModule } from './inscription/inscription.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'test',
			password: 'test',
			database: 'postgres',
			entities: [User, Contribution, Event],
			synchronize: true
		}),
		UserModule,
		ContributionModule,
		EventModule,
		InscriptionModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
