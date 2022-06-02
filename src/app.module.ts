import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

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
		UserModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
