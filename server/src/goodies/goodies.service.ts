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
			const thumb_path = (await this.goodiesRepository.findOneById(id))
				.thumbnail_filename;
			if (!thumb_path)
				throw new NotFoundException
			const file = fs.createReadStream(join(process.cwd(), thumb_path));
			this.logger.log(`Successfully got the thumbnail of goodies ${id}`, login);
			return new StreamableFile(file);
		} catch (error) {
			this.logger.error(`Failed to get thumbnail of goodies ${id} on database(${error})`, login);
			throw new InternalServerErrorException(`Failed to to get thumbnail of goodies ${id} on database(${error})`)
		}
	}

	saveThumbnail(id: number, file: Express.Multer.File, login: any) {
		try {
			let path = `assets/thumbnails/goodies/${id}.${file.mimetype.split('/')[1]}`
			fs.writeFile(
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
		} catch (error) {
			this.logger.error(`Failed to save thumbnail of goodies ${id} on database(${error})`, login);
			throw new InternalServerErrorException(`Failed to save thumbnail of goodies ${id} on database(${error})`)
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
			throw new InternalServerErrorException(`Failed to get all goodies on database (${error})`);
		}
	}

	async findOne(id: number, requestMaker: string): Promise<Goodies> {
		try {
			let goodies = await this.goodiesRepository.findOneBy({ id: id });
			console.log(goodies)
			if (!goodies)
				throw new NotFoundException(`Couldn't get goody with id ${id}`);
			this.logger.log(`Got goody with id ${id}`, requestMaker);
			return goodies;
		} catch (error) {
			this.logger.error(`Failed to find goodies ${id} on database(${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to find goodies ${id} on database(${error})`)
		}
	}

	async update(id: number, goodiesData: GoodiesDto, requestMaker: string): Promise<void> {
		try {
			if (!await this.findOne(id, requestMaker)) {
				this.logger.error(`Failed to update goodies with id ${id} : goodies does not exist`, requestMaker);
				throw new NotFoundException(`Failed to update goodies with id ${id} : goodies does not exist`);
			}
			await this.goodiesRepository.update(id, goodiesData);
			this.logger.warn(`Successfully updated goodies ${id}`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to update goodies ${id} on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to update goodies ${id} on database(${error})`)
		}
	}

	async create(goodiesDto: GoodiesDto, requestMaker: string): Promise<void> {
		try {
			await this.goodiesRepository.save(goodiesDto);
			this.logger.warn(`Successfully created new goodies ${goodiesDto.name} `, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to create goodies ${goodiesDto.name} on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to create goodies ${goodiesDto.name} on database(${error})`)
		}
	}

	async removeOne(id: number, requestMaker: string): Promise<void> {
		try {
			if (await this.findOne(id, requestMaker)) {
				await this.goodiesRepository.delete({ id: id });
				this.logger.warn(`Successfully deleted goodies ${id}`, requestMaker);
			}
			else
				this.logger.warn(`Failed to delete goodies ${id} : goodies does no exist`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to delete goodies ${id} on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to delete goodies ${id} on database(${error})`)
		}
	}

	async removeAll(requestMaker: string): Promise<void> {
		try {
			await this.goodiesRepository.delete({});
			this.logger.warn(`Successfully deleted all goodies`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to delete all goodies on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to delete all goodies on database(${error})`)
		}
	}
}
