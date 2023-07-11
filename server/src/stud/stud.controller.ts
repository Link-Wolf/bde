import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Session,
	UseGuards,
	Query,
} from "@nestjs/common";
import { Stud } from "../entity/Stud";
import { StudDto } from "./stud.dto";
import { StudService } from "./stud.service";
import { StudDtoPipe } from "./stud.pipe";
import { ClearanceGuard } from "../auth/clearance.guard";

@Controller("stud")
export class StudController {
	constructor(private studService: StudService) {}

	@Get()
	@UseGuards(new ClearanceGuard(5))
	findAll(
		@Session() session: Record<string, any>,
		@Query() query: any
	): Promise<Stud[]> {
		if (query.sort === undefined)
			return this.studService.findAll(session.login);
		return this.studService.findFilterd(
			JSON.parse(query.sort),
			session.login
		);
	}

	@Get("login")
	@UseGuards(new ClearanceGuard(5))
	findAllLogin(@Session() session: Record<string, any>): Promise<string[]> {
		return this.studService.findAllLogin(session.login);
	}

	@Get("minecraft")
	@UseGuards(new ClearanceGuard(5))
	findMe(@Session() session: Record<string, any>): Promise<Stud> {
		return this.studService.findOne(session.login, session.login);
	}

	@Get(":login")
	@UseGuards(new ClearanceGuard(5))
	findOne(
		@Session() session: Record<string, any>,
		@Param("login") login: string
	): Promise<Stud> {
		return this.studService.findOne(login, session.login);
	}

	@Get(":login/mail")
	@UseGuards(new ClearanceGuard(5))
	getMail(
		@Session() session: Record<string, any>,
		@Param("login") login: string
	): Promise<Stud> {
		return this.studService.getMail(login, session.login);
	}

	@Get("admin/members")
	@UseGuards(new ClearanceGuard(11))
	findAdmins(@Session() session: Record<string, any>): Promise<Stud[]> {
		return this.studService.findAdmins(session.login);
	}

	@Get("admin/noAdmin")
	@UseGuards(new ClearanceGuard(11))
	findNoAdmins(@Session() session: Record<string, any>): Promise<Stud[]> {
		return this.studService.findNoAdmins(session.login);
	}

	@Get("admin/volunteers")
	@UseGuards(new ClearanceGuard(11))
	findVolunteers(@Session() session: Record<string, any>): Promise<Stud[]> {
		return this.studService.findVolunteers(session.login);
	}

	@Get("admin/noVolunteers")
	@UseGuards(new ClearanceGuard(11))
	findNoVolunteer(@Session() session: Record<string, any>): Promise<Stud[]> {
		return this.studService.findNoVolunteers(session.login);
	}

	@Post()
	@UseGuards(new ClearanceGuard(5))
	create(
		@Session() session: Record<string, any>,
		@Body(new StudDtoPipe()) stud: StudDto
	) {
		return this.studService.create(stud, session.login);
	}

	@Patch(":login")
	@UseGuards(new ClearanceGuard(5))
	update(
		@Session() session: Record<string, any>,
		@Param("login") login: string,
		@Body(new StudDtoPipe()) stud: StudDto
	) {
		return this.studService.update(login, stud, session.login);
	}

	@Patch("admin/yeet/:login")
	@UseGuards(new ClearanceGuard(21))
	removeAdmin(
		@Session() session: Record<string, any>,
		@Param("login") login: string
	) {
		return this.studService.removeAdmin(login, session.login);
	}

	@Patch("admin/promote/:login")
	@UseGuards(new ClearanceGuard(21))
	addAdmin(
		@Session() session: Record<string, any>,
		@Param("login") login: string
	) {
		return this.studService.addAdmin(login, session.login);
	}

	@Patch("volunteers/yeet/:login")
	@UseGuards(new ClearanceGuard(11))
	removeVolunteer(
		@Session() session: Record<string, any>,
		@Param("login") login: string
	) {
		return this.studService.removeVolunteer(login, session.login);
	}

	@Patch("volunteers/promote/:login")
	@UseGuards(new ClearanceGuard(11))
	addVolunteer(
		@Session() session: Record<string, any>,
		@Param("login") login: string
	) {
		return this.studService.addVolunteer(login, session.login);
	}

	@Patch("admin/:login/mutiny")
	@UseGuards(new ClearanceGuard(21))
	mutiny(
		@Session() session: Record<string, any>,
		@Param("login") login: string
	) {
		return this.studService.changeCaptain(login, session.login);
	}

	@Delete(":login")
	@UseGuards(new ClearanceGuard(11))
	removeOne(
		@Session() session: Record<string, any>,
		@Param("login") login: string
	) {
		return this.studService.removeOne(login, session.login);
	}

	@Delete()
	@UseGuards(new ClearanceGuard(11))
	removeAll(@Session() session: Record<string, any>) {
		return this.studService.removeAll(session.login);
	}
}
