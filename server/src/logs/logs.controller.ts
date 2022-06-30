import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Logs } from '../entity/Logs'
import { LogsDto, LogsFilterDto } from './logs.dto';
import { LogsDtoPipe, LogsFilterDtoPipe } from './logs.pipe';

@Controller('admin/logs/')
export class LogsController {
	constructor(private logsService: LogsService) { }

	@Get('')
	findAll(): Promise<Logs[]> {
		return this.logsService.findAll();
	}

	// @Get('current')
	// findCurrent(): Promise<Logs[]> {
	// 	return this.logsService.findCurrent();
	// }
	//
	// @Get(':id')
	// findOne(@Param('id', ParseIntPipe) id: number): Promise<Logs> {
	// 	return this.logsService.findOne(id);
	// }
	//
	// @Post('')
	// create(@Body(new LogsDtoPipe()) logs: LogsDto) {
	// 	return this.logsService.create(logs);
	// }
	//
	// @Post('get')
	// findAllButFilter(@Body(new LogsFilterDtoPipe()) filters: LogsFilterDto): Promise<Logs[]> {
	// 	return this.logsService.findAll(filters);
	// }
	//
	// @Patch(':id')
	// update(@Param('id') id: number, @Body(new LogsDtoPipe()) logs: LogsDto) {
	// 	return this.logsService.update(id, logs);
	// }
	//
	// @Patch(':id/inscription')
	// subscribe(@Param('id') id: number, @Body('login') login: string) {
	// 	return this.logsService.subscribe(id, login);
	// }
	//
	// @Patch('admin/:id/inscription')
	// forceSubscribe(@Param('id') id: number, @Body('login') login: string) {
	// 	return this.logsService.forceSubscribe(id, login);
	// }
	//
	// @Delete(':id')
	// removeOne(@Param('id', ParseIntPipe) id: number) {
	// 	return this.logsService.removeOne(id);
	// }
	//
	// @Delete('')
	// removeAll() {
	// 	return this.logsService.removeAll();
	// }
}
