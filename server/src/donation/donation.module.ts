import { Module } from "@nestjs/common";
import { DonationService } from "./donation.service";
import { DonationController } from "./donation.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Donation } from "../entity/Donation";
import { LoggerModule } from "../logger/logger.module";

@Module({
	imports: [TypeOrmModule.forFeature([Donation]), LoggerModule],
	providers: [DonationService],
	controllers: [DonationController],
	exports: [DonationService],
})
export class DonationModule {}
