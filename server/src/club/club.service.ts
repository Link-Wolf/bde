import {
	Injectable, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Club } from '../entity/Club'
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';
import { ClubDto } from './club.dto';

@Injectable()
export class ClubService {
	constructor(
		@InjectRepository(Club)
		private clubRepository: Repository<Club>,
		private studService: StudService,
		private logger: LoggerService,
		private manager: EntityManager
	) { }

	async findAll(requestMaker: string): Promise<Club[]> {
		try {
			let clubs = await this.manager.query(`SELECT * FROM "club"`);
			this.logger.log(`Got all clubs`, requestMaker);
			return clubs;
		} catch (error) {
			this.logger.error(`Failed -> Get all club on database (${error})`, requestMaker);
			throw error
		}
	}

	async findOne(id: number, requestMaker: string): Promise<any> {
		try {
			let club = await this.clubRepository.findOneBy({ id: id });
			if (!club)
				this.logger.warn(`Failed -> Find club ${id} : club does not exist`, requestMaker)
			else
				this.logger.log(`Got club ${id}`, requestMaker);
			return club
		}
		catch (error) {
			this.logger.error(`Failed -> Find club ${id} on database (${error})`, requestMaker)
			throw error;
		}
	}

	async update(id: number, clubData: ClubDto, requestMaker: string): Promise<any> {
		console.log(clubData)
		try {
			if (!await this.findOne(id, requestMaker)) {
				this.logger.error(`Failed -> Update club with id ${id} : club ${id} does not exist`, requestMaker, true);
				throw new NotFoundException(`Failed to update club with id ${id} : club ${id} does not exist`);
			}
			let ret = await this.clubRepository.update(id, clubData);
			this.logger.warn(`Updated club ${id}`, requestMaker, true);
			return ret;
		} catch (error) {
			this.logger.error(`Failed -> Update club ${id} on database (${error})`, requestMaker, true)
			throw error
		}
	}

	async create(clubDto: ClubDto, requestMaker: string): Promise<any> {
		try {
			let ret = await this.clubRepository.save(clubDto);
			this.logger.warn(`Created new club ${clubDto.name}`, requestMaker, true);
			return (ret);
		} catch (error) {
			this.logger.error(`Failed -> Create club ${clubDto.name} on database (${error})`, requestMaker, true)
			throw error
		}
	}

	async removeOne(id: number, requestMaker: string): Promise<any> {
		try {
			if (await this.findOne(id, requestMaker)) {
				let ret = await this.clubRepository.delete({ id: id });
				this.logger.warn(`Deleted club ${id}`,
					requestMaker, true);
				return ret
			}
			else {
				this.logger.warn(`Failed -> Delete club ${id} : club doesn't exist`, requestMaker, true);
				throw new NotFoundException(`Failed to delete club ${id} : club doesn't exist`);
			}
		} catch (error) {
			this.logger.error(`Failed -> Delete club ${id} on database (${error})`, requestMaker, true)
			throw error
		}
	}

	async removeAll(requestMaker: string): Promise<any> {
		try {
			let ret = await this.clubRepository.delete({});
			this.logger.warn(`Deleted all clubs`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Delete all clubs on database (${error})`, requestMaker, true)
			throw error
		}
	}
}
