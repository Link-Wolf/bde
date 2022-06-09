import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  async error(message: any, stack?: string, context?: string) {
    await this.logRepository.save({message: message, type: "error"})
    super.error(message, stack, context);
  }
  async warn(message: any, stack?: string, context?: string) {
	await this.logRepository.save({message: message, type: "warn"})
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
