import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudService } from '../stud/stud.service';
import { jwtConstants } from './jwt.constant';

@Injectable()
export class AuthService {
	constructor(
		private studService: StudService,
		private jwtService: JwtService
	) { }

	async validateUser(login: string, password: string): Promise<any> {
		const stud = await this.studService.findOne(login);
		if (stud && password === "pass")
			return stud;
		return null;
	}

	async login(user: any) {
		const payload = { user: user };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
