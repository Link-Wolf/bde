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
		const stud = await this.studService.findOne(login, "42");
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

	async loginIntra(code: string) {
		let sessionToken: string
		try {
			return this.http.post('https://api.intra.42.fr/oauth/token', {
				redirect_uri: "http://k1r2p10.42mulhouse.fr:3000/log",
				code: code,
				grant_type: "authorization_code",
				client_id: intra_uid,
				client_secret: intra_secret
			}).toPromise()
				.then(response => {
					const token = response.data.access_token;
					const header = {
						'Authorization': `Bearer ${token}`
					}
					return this.http.get(
						"https://api.intra.42.fr/v2/me",
						{ headers: header })
						.toPromise()
						.then(async response => {
							let stud = {
								login: response.data.login,
								firstname: response.data.usual_first_name, //might need some fixes : test with Xxxxx's account voir si cette variable est set sur Xxxxx ou si il faut la tester
								lastname: response.data.last_name,
								isDirection: false,
								isPremium: false
							}
							const retStud = await this.studService.logUser(stud, "42");
							const jwt = this.jwtService.sign({
								user: {
									login: retStud.login,
									firstname: retStud.firstname,
									lastname: retStud.lastname,
									image_url: response.data.image_url,
									accreditation: retStud.acreditation
								}
							});
							return jwt
						})
						.catch(error => { return error })
				})
				.catch(error => { return error })
		} catch (error) { return error }
	}
}
