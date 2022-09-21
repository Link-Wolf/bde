import { Module, forwardRef } from '@nestjs/common';
import { StudService } from './stud.service';
import { StudController } from './stud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stud } from '../entity/Stud';
import { LoggerModule } from '../logger/logger.module';
import { ContributionModule } from '../contribution/contribution.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Stud]),
		LoggerModule,
		forwardRef(() => ContributionModule)
	],
	providers: [StudService],
	controllers: [StudController],
	exports: [StudService]
})
export class StudModule { }
