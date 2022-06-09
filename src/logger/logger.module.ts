import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../entity/Log';
import { CustomLogger } from './CustomLogger.class';
import { LogService } from './logger.service';

@Module({
	imports: [TypeOrmModule.forFeature([Log])],
	controllers: [],
	providers: [LogService, CustomLogger],
	exports: [CustomLogger, LogService]
})
export class LogModule { }
