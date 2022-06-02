import { Injectable } from '@nestjs/common';

@Injectable()
export class InscriptionService {
	findAll() {
		return "all inscription";
	}

	findOne(id: number) {
		return `inscription ${id}`;
	}

	async create() {
		return "inscription created";
	}

	async remove(id: number) {
		return `inscription ${id} deleted`;
	}
}
