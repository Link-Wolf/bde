import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class InscriptionService {
	constructor(
		private manager: EntityManager
	) { }

	removeAll() {
		this.manager.query(`DELETE FROM "inscriptions"`);
	}

	removeByStud(login: string) {
		this.manager.query(`DELETE FROM "inscriptions" WHERE "studLogin" = '${login}'`);
	}

	removeByEvent(id: number) {
		this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id}`);
	}

	link(id: number, login: string) {
		this.manager.query(`INSERT INTO "inscriptions" ("studLogin", "eventId") VALUES('${login}', ${id})`);
	}

	findByStud(login: string) {
		this.manager.query(`SELECT * FROM "inscriptions" WHERE "studLogin" = '${login}'`);
	}

	findByEvent(id: number) {
		this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId" = ${id}`);
	}

	findAll() {
		this.manager.query(`SELECT * FROM "inscriptions"`);
	}

	async remove(id: number, login: string) {
		this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);

	}
}
