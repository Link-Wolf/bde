import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logs } from '../entity/Logs';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [TypeOrmModule.forFeature([Logs]), LoggerModule],
	providers: [LogsService],
	controllers: [LogsController],
	exports: [LogsService]
})
export class LogsModule { }
