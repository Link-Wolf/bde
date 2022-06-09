import { Module } from '@nestjs/common';
import { StudService } from './stud.service';
import { StudController } from './stud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stud } from '../entity/Stud';
import { LogModule } from '../logger/logger.module';

@Module({
	imports: [TypeOrmModule.forFeature([Stud]), LogModule],
	providers: [StudService],
	controllers: [StudController],
	exports: [StudService]
})
export class StudModule { }
