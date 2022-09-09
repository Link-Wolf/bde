import {
	Injectable, InternalServerErrorException,
	NotFoundException, StreamableFile
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Goodies } from '../entity/Goodies'
import { LoggerService } from '../logger/logger.service';
import { GoodiesDto } from './goodies.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class GoodiesService {

	constructor(
		@InjectRepository(Goodies)
		private goodiesRepository: Repository<Goodies>,
		private logger: LoggerService,
	) { }

	async getThumbnail(id: number, login: any) {
		try {
			const event = await this.goodiesRepository.findOneById(id)
			if (!event)
				throw new NotFoundException
			const thumb_path = event.thumbnail_filename;
			if (!thumb_path)
				throw new NotFoundException
			const file = fs.createReadStream(join(process.cwd(), thumb_path));
			this.logger.log(`Successfully got the thumbnail of goodies ${id}`, login);
			return new StreamableFile(file);
		} catch (error) {
			this.logger.error(`Failed to get thumbnail of goodies ${id} on database(${error})`, login);
			throw error
		}
	}

	async saveThumbnail(id: number, file: Express.Multer.File, login: any) {
		try {
			let path = `assets/thumbnails/goodies/${id}.${file.mimetype.split('/')[1]}`
			let ret = fs.writeFile(
				path,
				file.buffer,
				(err) => {
					if (err) {
						this.logger.error(`Error while creating goodies ${id} thumbnail(${err})`,
							login);
						throw err
					}
					else {
						this.goodiesRepository.update(id, {
							thumbnail_filename: path
						})
						this.logger.log(`Successfully saved thumbnail of goodies ${id}`, login)
					}
				})
			return ret
		} catch (error) {
			this.logger.error(`Failed to save thumbnail of goodies ${id} on database(${error})`, login);
			throw error
		}
	}

	async findAll(requestMaker: string):
		Promise<Goodies[]> {
		try {
			let goodies = await this.goodiesRepository.find();
			this.logger.log(`Got all goodies`, requestMaker);
			return goodies;
		}
		catch (error) {
			this.logger.error(`Failed to get all goodies on database (${error})`, requestMaker)
			throw error
		}
	}

	async findOne(id: number, requestMaker: string): Promise<Goodies> {
		try {
			let goodies = await this.goodiesRepository.findOneBy({ id: id });
			if (!goodies)
				throw new NotFoundException(`Couldn't get goody with id ${id}`);
			this.logger.log(`Got goody with id ${id}`, requestMaker);
			return goodies;
		} catch (error) {
			this.logger.error(`Failed to find goodies ${id} on database(${error})`, requestMaker);
			throw error
		}
	}

	async update(id: number, goodiesData: GoodiesDto, requestMaker: string): Promise<any> {
		try {
			if (!await this.findOne(id, requestMaker)) {
				this.logger.error(`Failed to update goodies with id ${id} : goodies does not exist`, requestMaker);
				throw new NotFoundException(`Failed to update goodies with id ${id} : goodies does not exist`);
			}
			let ret = await this.goodiesRepository.update(id, goodiesData);
			this.logger.warn(`Successfully updated goodies ${id}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to update goodies ${id} on database(${error})`, requestMaker)
			throw error
		}
	}

	async create(goodiesDto: GoodiesDto, requestMaker: string): Promise<any> {
		try {
			let ret = await this.goodiesRepository.save(goodiesDto);
			this.logger.warn(`Successfully created new goodies ${goodiesDto.name} `, requestMaker);
			return (ret)
		} catch (error) {
			this.logger.error(`Failed to create goodies ${goodiesDto.name} on database(${error})`, requestMaker)
			throw error
		}
	}

	async removeOne(id: number, requestMaker: string): Promise<any> {
		try {
			if (await this.findOne(id, requestMaker)) {
				let ret = await this.goodiesRepository.delete({ id: id });
				this.logger.warn(`Successfully deleted goodies ${id}`, requestMaker);
				return ret
			}
			else
				this.logger.warn(`Failed to delete goodies ${id} : goodies does no exist`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to delete goodies ${id} on database(${error})`, requestMaker)
			throw error
		}
	}

	async removeAll(requestMaker: string): Promise<any> {
		try {
			let ret = await this.goodiesRepository.delete({});
			this.logger.warn(`Successfully deleted all goodies`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to delete all goodies on database(${error})`, requestMaker)
			throw error
		}
	}
}
