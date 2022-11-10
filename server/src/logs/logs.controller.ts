import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Session, UseGuards, UploadedFiles, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Logs } from '../entity/Logs'
import { LogsDto, LogsFilterDto } from './logs.dto';
import { LogsDtoPipe, LogsFilterDtoPipe } from './logs.pipe';
import { ClearanceGuard } from '../auth/clearance.guard';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('admin/logs/')
@UseGuards(new ClearanceGuard(11))
export class LogsController {
	constructor(private logsService: LogsService) { }

	@Get('')
	findAll(@Session() session: Record<string, any>): Promise<Logs[]> {
		return this.logsService.findAll(null, session.login);
	}

	@UseGuards(new ClearanceGuard(42))
	@Get('file')
	blobAll(@Session() session: Record<string, any>) {
		return this.logsService.blobAll(session.login);
	}

	@UseGuards(new ClearanceGuard(42))
	@Post('file')
	@UseInterceptors(FileInterceptor('log'))
	async uploadLog(
		@UploadedFile() file: Express.Multer.File,
		@Session() session: Record<string, any>
	) {
		return this.logsService.uploadLog(file, session.login)
	}

	@Post('get')
	findAllButFilter(
		@Body(new LogsFilterDtoPipe()) filters: LogsFilterDto,
		@Session() session: Record<string, any>): Promise<Logs[]> {
		return this.logsService.findAll(filters, session.login);
	}
}
