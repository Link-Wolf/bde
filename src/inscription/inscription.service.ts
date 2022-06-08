import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

	async subscribe(id: number, login: string) {
		await this.inscriptionRepository.save()
	}

	async create() {
		return "inscription created";
	}

	async remove(id: number) {
		return `inscription ${id} deleted`;
	}
}
