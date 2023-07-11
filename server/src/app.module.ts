import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Goodies } from "./entity/Goodies";
import { Event } from "./entity/Event";
import { Stud } from "./entity/Stud";
import { Club } from "./entity/Club";
import { StudModule } from "./stud/stud.module";
import { ClubModule } from "./club/club.module";
import { EventModule } from "./event/event.module";
import { InscriptionModule } from "./inscription/inscription.module";
import { LoggerModule } from "./logger/logger.module";
import { LogsModule } from "./logs/logs.module";
import { Logs } from "./entity/Logs";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { GoodiesModule } from "./goodies/goodies.module";
import { Donation } from "./entity/Donation";
import { DonationModule } from "./donation/donation.module";
import { Inscription } from "./entity/Inscription";
import { PingPongGame } from "./entity/PingPongGame";
import { PingPongGameModule } from "./pingPongGame/pingPongGame.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [".env"],
		}),
		TypeOrmModule.forRoot({
			type: "postgres",
			port: +process.env.POSTGRES_PORT,
			host: process.env.POSTGRES_HOST,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [
				Stud,
				Event,
				Logs,
				Goodies,
				Club,
				Inscription,
				Donation,
				PingPongGame,
			],
			synchronize: true,
		}),
		StudModule,
		ClubModule,
		EventModule,
		DonationModule,
		GoodiesModule,
		InscriptionModule,
		LogsModule,
		LoggerModule,
		AuthModule,
		PingPongGameModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
