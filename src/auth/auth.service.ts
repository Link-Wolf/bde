import { Injectable } from '@nestjs/common';
import { StudService } from '../stud/stud.service';

@Injectable()
export class AuthService {
	constructor(private studService: StudService) { }

	async validateUser(login: string, password: string): Promise<any> {
		const stud = await this.studService.findOne(login);
		if (stud && password === "pass")
			return stud;
		return null;
	}
}
