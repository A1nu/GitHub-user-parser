import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class GithubService {
	private clientId = '60b2fb9b7c5bcff2d316';
	private clientSecret = 'fe37b677b90c873588b7e599984a9865fcc4f798';
	private accessToken: string;

	constructor(private http: HttpClient) {}

	getToken(code: string): Promise<any> {
		const url =
			'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token';

		return this.http
			.post(url, null, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded'
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

	requestData(query: string, variables: string): Promise<any> {
		const url = 'https://api.github.com/graphql';

		return this.http
			.post(
				url,
				{ query: query, variables: variables },
				{
					headers: {
						Authorization: `bearer ${this.accessToken}`
					}
				}
			)
			.toPromise()
			.then((data) => {
				return data;
			});
	}

	setToken(token: string): void {
		this.accessToken = token;
	}
}
