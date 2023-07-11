import { Module, forwardRef } from "@nestjs/common";
import { StudService } from "./stud.service";
import { StudController } from "./stud.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stud } from "../entity/Stud";
import { LoggerModule } from "../logger/logger.module";

@Module({
	imports: [TypeOrmModule.forFeature([Stud]), LoggerModule],
	providers: [StudService],
	controllers: [StudController],
	exports: [StudService],
})
export class StudModule {}
