import { ConsoleLogger } from '@nestjs/common';
import { LogService } from './logger.service';

export class CustomLogger extends ConsoleLogger {
	// private logService: LogService

	async error(message: any, stack?: string, context?: string) {
		// this.logService.create(message, "error");
		super.error(message, stack, context);
	}
	async warn(message: any, stack?: string, context?: string) {
		// this.logService.create(message, "warn");
		super.warn(message, stack, context);
	}
	log(message: any, stack?: string, context?: string) {
		super.log(message, stack, context);
	}
	verbose(message: any, stack?: string, context?: string) {
		super.verbose(message, stack, context);
	}
	debug(message: any, stack?: string, context?: string) {
		super.debug(message, stack, context);
	}
}
