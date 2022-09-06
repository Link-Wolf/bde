import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ClearanceGuard implements CanActivate {
	constructor(private clearanceNeeded: number) { }
	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest();
		const session = req.session;
		return session.clearance >= this.clearanceNeeded;
	}
}
