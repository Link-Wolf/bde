import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entity/Event';
import { StudModule } from '../stud/stud.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [TypeOrmModule.forFeature([Event]), StudModule, LoggerModule],
	providers: [EventService],
	controllers: [EventController],
	exports: [EventService]
})
export class EventModule { }
