import {
	Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
	Session, UseInterceptors, UploadedFile, Res, UseGuards
} from '@nestjs/common';
import { GoodiesService } from './goodies.service';
import { Goodies } from '../entity/Goodies'
import { GoodiesDto } from './goodies.dto';
import { GoodiesDtoPipe, FileTypeValidationPipe } from './goodies.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { ClearanceGuard } from '../auth/clearance.guard';

@Controller('goodies/')
export class GoodiesController {
	constructor(private goodiesService: GoodiesService) { }

	@Get('')
	findAll(@Session() session: Record<string, any>): Promise<Goodies[]> {
		return this.goodiesService.findAll(session.login);
	}

	@Get(':id')
	findOne(
		@Session() session: Record<string, any>,
		@Param('id', ParseIntPipe) id: number): Promise<Goodies> {
		return this.goodiesService.findOne(id, session.login);
	}

	@Get(':id/thumbnail')
	async getThumbnail(
		@Param('id', ParseIntPipe) id: number,
		@Session() session: Record<string, any>) {
		return this.goodiesService.getThumbnail(id, session.login)
	}

	@Post('')
	@UseGuards(new ClearanceGuard(11))
	create(
		@Session() session: Record<string, any>,
		@Body(new GoodiesDtoPipe()) goodies: GoodiesDto) {
		return this.goodiesService.create(goodies, session.login);
	}

	@Post('upload_image/:id')
	@UseGuards(new ClearanceGuard(11))
	@UseInterceptors(FileInterceptor('thumbnail'))
	async uploadImage(
		@Param('id', ParseIntPipe) id: number,
		@UploadedFile(new FileTypeValidationPipe()) file: Express.Multer.File,
		@Session() session: Record<string, any>) {
		return this.goodiesService.saveThumbnail(id, file, session.login)
	}

	@Patch(':id')
	@UseGuards(new ClearanceGuard(11))
	update(
		@Session() session: Record<string, any>, @Param('id') id: number,
		@Body(new GoodiesDtoPipe()) goodies: GoodiesDto) {
		return this.goodiesService.update(id, goodies, session.login);
	}

	@Delete(':id')
	@UseGuards(new ClearanceGuard(11))
	removeOne(
		@Session() session: Record<string, any>,
		@Param('id', ParseIntPipe) id: number) {
		return this.goodiesService.removeOne(id, session.login);
	}

	@Delete('')
	@UseGuards(new ClearanceGuard(11))
	removeAll(@Session() session: Record<string, any>) {
		return this.goodiesService.removeAll(session.login);
	}
}
