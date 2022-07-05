import { Injectable, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudService } from '../stud/stud.service';
const { intra_uid, intra_secret } = require("../../config.json")

@Injectable()
export class AuthService {
	constructor(
		private studService: StudService,
		private jwtService: JwtService,
		private readonly http: HttpService
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

	async getToken(code: string) {
		try {
			let resp = this.http.post('https://api.intra.42.fr/oauth/token', {
				redirect_uri: "http://k1r2p10.42mulhouse.fr:3000/log",
				code: code,
				grant_type: "authorization_code",
				client_id: intra_uid,
				client_secret: intra_secret
			}).toPromise()
				.then(resp => console.log(";))))))", resp, ";))))))))"))
				.catch(error => console.log(error.response.data))
			return resp
		} catch (error) { console.log(error) }
	}
}
