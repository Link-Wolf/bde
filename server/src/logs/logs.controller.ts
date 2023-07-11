import {
	Body,
	Controller,
	Get,
	Post,
	Session,
	UseGuards,
} from "@nestjs/common";
import { LogsService } from "./logs.service";
import { Logs } from "../entity/Logs";
import { LogsFilterDto } from "./logs.dto";
import { LogsFilterDtoPipe } from "./logs.pipe";
import { ClearanceGuard } from "../auth/clearance.guard";

@Controller("admin/logs/")
@UseGuards(new ClearanceGuard(11))
export class LogsController {
	constructor(private logsService: LogsService) {}

	@Get("")
	findAll(@Session() session: Record<string, any>): Promise<Logs[]> {
		return this.logsService.findAll(null, session.login);
	}

	@UseGuards(new ClearanceGuard(42))
	@Get("file")
	blobAll(@Session() session: Record<string, any>) {
		return this.logsService.blobAll(session.login);
	}

	@Post("get")
	findAllButFilter(
		@Body(new LogsFilterDtoPipe()) filters: LogsFilterDto,
		@Session() session: Record<string, any>
	): Promise<Logs[]> {
		return this.logsService.findAll(filters, session.login);
	}
}
