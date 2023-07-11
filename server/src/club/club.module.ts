import { Module } from "@nestjs/common";
import { ClubService } from "./club.service";
import { ClubController } from "./club.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Club } from "../entity/Club";
import { StudModule } from "../stud/stud.module";
import { LoggerModule } from "../logger/logger.module";

@Module({
	imports: [TypeOrmModule.forFeature([Club]), StudModule, LoggerModule],
	providers: [ClubService],
	controllers: [ClubController],
	exports: [ClubService],
})
export class ClubModule {}
