import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entity/Event';
import { Inscription } from '../entity/Inscription';
import { Stud } from '../entity/Stud';

@Injectable()
export class InscriptionService {
	constructor(
		@InjectRepository(Inscription)
		private inscriptionRepository: Repository<Inscription>,
	) { }

	findAll() {
		return "all inscription";
	}

	findOne(id: number) {
		return `inscription ${id}`;
	}

	async create(stud: Stud, event: Event) {
		await this.inscriptionRepository.save({
			stud: stud,
			event: event
		})
	}

	async remove(id: number) {
		return `inscription ${id} deleted`;
	}
}
