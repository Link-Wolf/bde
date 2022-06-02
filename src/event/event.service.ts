import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entity/Event'

@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private usersRepository: Repository<Event>,
	) { }

	findAll(): Promise<Event[]> {
		return this.usersRepository.find();
	}

	findOne(id: number): Promise<Event> {
		return this.usersRepository.findOneBy({ id: id });
	}

	async create(event: Event): Promise<void> {
		this.usersRepository.save(event);
	}

	async remove(id: number): Promise<void> {
		await this.usersRepository.delete({ id: id });
	}
}