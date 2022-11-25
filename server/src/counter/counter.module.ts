import { Module } from '@nestjs/common';
import { CounterController } from './counter.controller';
import { Counter } from '../entity/Conter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounterService } from './counter.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [TypeOrmModule.forFeature([Counter]), LoggerModule],
	providers: [CounterService],
	controllers: [CounterController]
})
export class CounterModule { }
