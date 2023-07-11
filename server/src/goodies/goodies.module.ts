import { Module } from "@nestjs/common";
import { GoodiesService } from "./goodies.service";
import { GoodiesController } from "./goodies.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Goodies } from "../entity/Goodies";
import { LoggerModule } from "../logger/logger.module";

@Module({
	imports: [TypeOrmModule.forFeature([Goodies]), LoggerModule],
	providers: [GoodiesService],
	controllers: [GoodiesController],
	exports: [GoodiesService],
})
export class GoodiesModule {}
