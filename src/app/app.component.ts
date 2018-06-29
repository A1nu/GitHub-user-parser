import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GithubService } from './github.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	public logged = false;

	constructor(
		private translate: TranslateService,
		private gitHub: GithubService,
		private cookieService: CookieService
	) {
		translate.setDefaultLang('en');
		translate.use('en');
	}

	ngOnInit() {
		if (this.cookieService.check('token')) {
			console.log(this.cookieService.get('token'), 'cookie is exist');
			this.gitHub.setToken(this.cookieService.get('token'));
			this.logged = true;
		} else if (window.location.href.includes('?code=')) {
			const url = window.location.href;

			this.gitHub
				.getToken(url.substr(url.lastIndexOf('?code=') + 6, url.length))
				.then((token) => {
					console.log(token);
					this.cookieService.set('token', token);
					this.logged = true;
				});
			window.history.pushState(
				'',
				'',
				url.substr(0, url.lastIndexOf('?code='))
			);
		}
		this.gitHub.getPopularUsersList();
	}

	logIntoGithub() {
		const url = 'https://github.com/login/oauth/authorize';
		const callbackUrl = window.location.origin;
		const clientId = '60b2fb9b7c5bcff2d316';
		const a = document.createElement('a');

		document.body.appendChild(a);
		a.setAttribute('style', 'display: none;');
		a.href = `${url}?client_id=${clientId}&redirect_uri=${callbackUrl}`;

		a.click();
		a.remove();
	}
}
