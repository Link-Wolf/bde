import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entity/Event';

@Module({
	imports: [TypeOrmModule.forFeature([Event])],
	providers: [EventService],
	controllers: [EventController]
})
export class EventModule { }
