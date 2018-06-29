import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class GithubService {
	private clientId = '60b2fb9b7c5bcff2d316';
	private clientSecret = 'fe37b677b90c873588b7e599984a9865fcc4f798';
	private accessToken: string;
	private apiLink = 'https://api.github.com';

	constructor(private http: HttpClient) {}

	getToken(code: string): Promise<any> {
		const url = 'https://github.com/login/oauth/access_token';

		return this.http
			.post(url, null, {
				headers: {
					Accept: 'application/json'
				},
				responseType: 'json',
				params: {
					client_id: this.clientId,
					client_secret: this.clientSecret,
					code: code
				}
			})
			.toPromise()
			.then((data) => {
				this.accessToken = data['access_token'];
				return this.accessToken;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	getPopularUsersList() {
		const url = `${this.apiLink}/search/users`;
		this.http
			.get(url, {
				params: {
					q: 'followers'
				}
			})
			.subscribe((data) => {
				console.log(data);
			});
	}

	setToken(token: string) {
		this.accessToken = token;
	}
}
