import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContributionModule } from './contribution/contribution.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 4343,
			username: 'root',
			password: 'root',
			database: 'bdedb',
			entities: [],
			synchronize: true
		}),
		ContributionModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
