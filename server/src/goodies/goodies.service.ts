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
import JSZip = require('jszip');

@Injectable()
export class GoodiesService {

	constructor(
		@InjectRepository(Goodies)
		private goodiesRepository: Repository<Goodies>,
		private logger: LoggerService,
	) { }

	async getThumbnail(id: number, login: any) {
		try {
			const goodies = await this.goodiesRepository.findOneById(id)
			if (!goodies) {
				this.logger.error(`Failed -> Get thumbnail of goodies ${id} : goodies doesn't exist`, login);
				throw new NotFoundException(`Failed to get thumbnail of goodies ${id} : goodies doesn't exist`)
			}
			const thumb_path = goodies.thumbnail_filename;
			if (!thumb_path) {
				this.logger.error(`Failed -> Get thumbnail of goodies ${id} : goodies doesn't has any thumbnail`, login);
				throw new NotFoundException(`Failed to get thumbnail of goodies ${id} : goodies doesn't has any thumbnail`)
			}
			const file = fs.createReadStream(join(process.cwd(), thumb_path));
			this.logger.log(`Got thumbnail of goodies ${id}`, login);
			return new StreamableFile(file);
		} catch (error) {
			this.logger.error(`Failed -> Get thumbnail of goodies ${id} on database (${error})`, login);
			throw error
		}
	}

	async getAlbum(id: number, login: any) {
		try {
			const goodies = await this.goodiesRepository.findOneById(id);
			if (!goodies || !fs.existsSync(`assets/album/goodies/${id}`)) {
				this.logger.error(`Failed -> Get album of googies ${id} : googies doesn't exist or does not have an album`, login);
				throw new NotFoundException(`Failed to get album of googies ${id}`)
			}
			const addFilesFromDirectoryToZip =
				(directoryPath = `assets/album/goodies/${id}`, zip: JSZip) => {
					const directoryContents = fs.readdirSync(directoryPath, {
						withFileTypes: true,
					});

					directoryContents.forEach(({ name }) => {
						const path = `${directoryPath}/${name}`;

						if (fs.statSync(path).isFile()) {
							zip.file(`${name}`, fs.readFileSync(path));
						}

						if (fs.statSync(path).isDirectory()) {
							addFilesFromDirectoryToZip(path, zip);
						}
					});
				};

			const directoryPath = `assets/album/googies/${id}`
			const zip = new JSZip();

			addFilesFromDirectoryToZip(directoryPath, zip);
			const zipAsBase64 = await zip.generateAsync({ type: "base64" });
			this.logger.log(`Got album of googies ${id}`, login);

			return zipAsBase64;
		} catch (error) {
			this.logger.error(`Failed -> Get album of googies ${id} on database (${error})`, login);
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
						this.logger.error(`Failed -> Create goodies ${id} thumbnail (${err})`,
							login, true);
						throw err
					}
					else {
						this.goodiesRepository.update(id, {
							thumbnail_filename: path
						})
						this.logger.log(`Saved thumbnail of goodies ${id}`, login, true)
					}
				})
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Save thumbnail of goodies ${id} on database (${error})`, login, true);
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
			this.logger.error(`Failed -> Get all goodies on database (${error})`, requestMaker)
			throw error
		}
	}

	async findOne(id: number, requestMaker: string): Promise<Goodies> {
		try {
			let goodies = await this.goodiesRepository.findOneBy({ id: id });
			if (!goodies) {
				this.logger.error(`Failed -> Get goodies ${id} : goodies ${id} doesn't exist`, requestMaker);
				throw new NotFoundException(`Failed to get goodies ${id} : goodies ${id} doesn't exist`);
			}
			this.logger.log(`Got goodies with id ${id}`, requestMaker);
			return goodies;
		} catch (error) {
			this.logger.error(`Failed -> Get goodies ${id} on database (${error})`, requestMaker);
			throw error
		}
	}

	async update(id: number, goodiesData: GoodiesDto, requestMaker: string): Promise<any> {
		try {
			if (!await this.findOne(id, requestMaker)) {
				this.logger.error(`Failed -> Update goodies ${id} : goodies ${id} doesn't exist`, requestMaker, true);
				throw new NotFoundException(`Failed to update goodies ${id} : goodies doesn't exist`);
			}
			let ret = await this.goodiesRepository.update(id, goodiesData);
			this.logger.warn(`Updated goodies ${id}`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Update goodies ${id} on database (${error})`, requestMaker, true)
			throw error
		}
	}

	async create(goodiesDto: GoodiesDto, requestMaker: string): Promise<any> {
		try {
			let ret = await this.goodiesRepository.save(goodiesDto);
			this.logger.warn(`Created new goodies ${goodiesDto.name}`, requestMaker, true);
			return (ret)
		} catch (error) {
			this.logger.error(`Failed -> Create goodies ${goodiesDto.name} on database (${error})`, requestMaker, true)
			throw error
		}
	}

	async removeOne(id: number, requestMaker: string): Promise<any> {
		try {
			if (await this.findOne(id, requestMaker)) {
				let ret = await this.goodiesRepository.delete({ id: id });
				this.logger.warn(`Deleted goodies ${id}`, requestMaker, true);
				return ret
			}
			else {
				this.logger.warn(`Failed -> Delete goodies ${id} : goodies doesn't exist`, requestMaker, true);
				throw new NotFoundException(`Failed to delete goodies ${id} : goodies doesn't exist`);
			}
		} catch (error) {
			this.logger.error(`Failed to delete goodies ${id} on database(${error})`, requestMaker, true)
			throw error
		}
	}

	async removeAll(requestMaker: string): Promise<any> {
		try {
			let ret = await this.goodiesRepository.delete({});
			this.logger.warn(`Deleted all goodies`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Delete all goodies on database(${error})`, requestMaker, true)
			throw error
		}
	}
}
