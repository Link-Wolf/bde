import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { EntityManager } from "typeorm";
import { StudService } from "../stud/stud.service";
import { JwtAuthGuard } from "./jwtAuth.guard";

@Injectable()
export class getGuard extends JwtAuthGuard {
	constructor(
		private studService: StudService,
		reflector: Reflector,
		private manager: EntityManager
	) {
		super(reflector)
	}

	canActivate(context: ExecutionContext | any) {
		if (!this.manager.query(`SELECT * FROM "stud_roles_role" WHERE "studLogin" = '${context.args[0].user.login}'`).then((roles) => {
			roles.forEach(role => {
				if (role.canGet)
					return true
				return false
			});
		})) return false;
		return super.canActivate(context);
	}
}
