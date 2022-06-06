import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entity/Event'
import { EventDto } from './event.dto';

@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
	) { }

	findAll(): Promise<Event[]> {
		return this.eventRepository.find();
	}

	findCurrent(): Promise<Event[]> {
		return this.eventRepository.findBy({
			end_date: IsNull() || MoreThanOrEqual(new Date(Date.now()))
		});
	}

	findOne(id: number): Promise<Event> {
		return this.eventRepository.findOneBy({ id: id });
	}

	async update(id: number, event: EventDto): Promise<void> {
		let old_event = await this.eventRepository.findOneBy({ id: id })
		let begin = new Date(old_event.begin_date);
		let end = new Date(old_event.end_date);
		if("begin_date" in event)
		{
			let event_begin = new Date(event.begin_date);
			begin.setTime(event_begin.getTime())
		}
		if ("end_date" in event)
		{
			let event_end = new Date(event.end_date);
			end.setTime(event_end.getTime())
		}
		console.log(event)
		console.log(old_event)
		await this.eventRepository.update(old_event, {
			name: String(event.name) || old_event.name,
			cost: Number(event.cost) || old_event.cost,
			premium_cost: Number(event.premium_cost) || old_event.premium_cost,
			nb_places: Number(event.nb_places) || old_event.nb_places,
			desc: String(event.desc) || old_event.desc,
			begin_date: begin || old_event.begin_date,
			end_date: end //|| old_event.end_date
		})
		console.log(old_event)
		console.log(end)
    }

	async create(eventDto: EventDto): Promise<void> {
		let begin = new Date(eventDto.begin_date);
		let end = new Date(eventDto.end_date);
		const event = {
			name: String(eventDto.name),
			cost: Number(eventDto.cost),
			premium_cost: Number(eventDto.premium_cost || eventDto.cost),
			nb_places: Number(eventDto.nb_places),
			desc: String(eventDto.desc || eventDto.name),
			begin_date: begin,
			end_date: "end_date" in eventDto ? end : null
		}
		console.log("Create the event :")
		console.log(event)
		await this.eventRepository.save(event);
	}

	async removeOne(id: number): Promise<void> {
		await this.eventRepository.delete({ id: id });
	}

	async removeAll(): Promise<void> {
		await this.eventRepository.delete({});
	}
}
