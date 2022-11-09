import { Injectable } from '@nestjs/common';
import { StudService } from '../stud/stud.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
	constructor(
		private studService: StudService,
		private httpService: HttpService
	) { }

	async loginIntra(code: string) {
		try {
			return this.httpService.post('https://api.intra.42.fr/oauth/token', {
				redirect_uri: process.env.APP_URL + "/log",
				code: code,
				grant_type: "authorization_code",
				client_id: process.env.INTRA_UID,
				client_secret: process.env.INTRA_SECRET
			}).toPromise()
				.then(async response => {
					const token = response.data.access_token;
					const header = {
						'Authorization': `Bearer ${token}`
					}
					return this.httpService.get(
						"https://api.intra.42.fr/v2/me",
						{ headers: header })
						.toPromise().then(async response => {

							let recent = 0;
							if (response.data.cursus_users.length != 1) {
								for (
									let i = 0;
									i < response.data.cursus_users.length;
									i++) {
									if (response.data.cursus_users[i].begin_at
										> response.data.cursus_users[recent]
											.begin_at)
										recent = i
								}
							}
							let clear: number;
							if (response.data
								.campus[response.data.campus.length - 1]
								.city.toLowerCase() != 'mulhouse')
								clear = 2;
							else if (response.data
								.cursus_users[recent].cursus
								.kind.toLowerCase() == 'piscine')
								clear = 5;
							else
								clear = 7;
							let stud = {
								login: response.data.login,
								firstname: response.data.usual_first_name
									? response.data.usual_first_name
									: response.data.first_name,
								lastname: response.data.last_name,
								isAdmin: false,
								clearance: clear,
								email: response.data.email,
								img_medium: response.data.image.versions.large,
								img_small: response.data.image.versions.small,
								true_email: null
							}
							const retStud = await this.studService
								.logUser(stud, "42intra-API");

							return {
								login: retStud.login,
								firstname: retStud.firstname,
								lastname: retStud.lastname,
								image_url: response.data.image.versions.small,
								clearance: retStud.clearance,
								mail: response.data.email
							}
						})
						.catch(error => { throw error })
				})
				.catch(error => { throw error })
		} catch (error) {
			throw error
		}
	}
}
