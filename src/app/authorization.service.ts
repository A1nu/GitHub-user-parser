import { Injectable } from '@angular/core';
import { GithubService } from './github.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
	providedIn: 'root'
})
export class AuthorizationService {
	private firstLoad = true;
	constructor(
		private gitHubService: GithubService,
		private cookieService: CookieService
	) {}

	getAuthorizationStatus(): boolean {
		if (this.firstLoad) {
			this.gitHubService.setToken(this.cookieService.get('token'));
			this.firstLoad = false;
		}
		return (
			this.cookieService.check('token') &&
			this.cookieService.get('token') !== 'undefined'
		);
	}

	authorizeWithCode(code: string) {
		return this.gitHubService.getToken(code).then((token) => {
			this.cookieService.set('token', token);
		});
	}
}
