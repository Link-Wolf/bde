import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entity/Event';
import { StudModule } from '../stud/stud.module';
import { LogModule } from '../logger/logger.module';

@Module({
	imports: [TypeOrmModule.forFeature([Event]), StudModule, LogModule],
	providers: [EventService],
	controllers: [EventController]
})
export class EventModule { }
