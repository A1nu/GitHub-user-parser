import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GithubService } from './github.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthorizationService } from './authorization.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	public logged = false;
	public pendingAuthorisation = false;

	constructor(
		private translate: TranslateService,
		private gitHubService: GithubService,
		private cookieService: CookieService,
		private authorizationService: AuthorizationService
	) {
		translate.setDefaultLang('en');
		translate.use('en');
	}

	ngOnInit() {
		this.checkAuthorization();
	}

	checkAuthorization(): void {
		if (this.authorizationService.getAuthorizationStatus()) {
			this.logged = true;
		} else if (window.location.href.includes('?code=')) {
			const url = window.location.href;
			const code = url.substr(url.lastIndexOf('?code=') + 6, url.length);

			this.pendingAuthorisation = true;
			this.authorizationService.authorizeWithCode(code).then(() => {
				this.pendingAuthorisation = false;
				this.logged = true;
			});

			window.history.pushState(
				'',
				'',
				url.substr(0, url.lastIndexOf('?code='))
			);
		}
	}

	logIntoGithub() {
		const url = 'https://github.com/login/oauth/authorize';
		const callbackUrl = window.location.origin;
		const clientId = '60b2fb9b7c5bcff2d316';
		const scope = 'read:org';
		const a = document.createElement('a');

		document.body.appendChild(a);
		a.setAttribute('style', 'display: none;');
		a.href = `${url}?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=${scope}`;

		a.click();
		a.remove();
	}
}
