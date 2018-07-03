import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github.service';
import { AuthorizationService } from '../authorization.service';

@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
	public userDisplayedList;
	public contentLoading = false;
	public model: any = {};
	public userDisplayedList = [];

	private mostPopularUserSchema =
		'query SearchMostPopular($queryString: String!) {\n' +
		'  search(query: $queryString, type: USER, first: 10) {\n' +
		'    userCount\n' +
		'    nodes {\n' +
		'      __typename\n' +
		'      ... on User {\n' +
		'        name\n' +
		'        login\n' +
		'        url\n' +
		'        avatarUrl\n' +
		'        repositories(first: 3) {\n' +
		'          nodes {\n' +
		'            name\n' +
		'            url\n' +
		'          }\n' +
		'        }\n' +
		'      }\n' +
		'    }\n' +
		'  }\n' +
		'}\n';
	private mostPopularUserQuery = '{ "queryString": "followers:>10000" }';

	constructor(
		private gitHubService: GithubService,
		private authorizationService: AuthorizationService
	) {}

	ngOnInit() {
		this.getAuthorizationStatus();
	}

	onSubmit() {
		alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model));
	}

	redirectToUrl(url: string) {
		const a = document.createElement('a');

		document.body.appendChild(a);
		a.setAttribute('style', 'display: none;');
		a.setAttribute('target', '_blank');
		a.href = url;

		a.click();
		a.remove();
	}

	sortByNameLength(data) {
		return data.sort((a, b) => {
			return a.name.length - b.name.length;
		});
	}

	getPopularUsers() {
		this.contentLoading = true;
		this.gitHubService
			.getPopularUsersList(
				this.mostPopularUserSchema,
				this.mostPopularUserQuery
			)
			.then((data) => {
				this.contentLoading = false;
				this.userDisplayedList = data['data']['search']['nodes'];
			});
	}

	getAuthorizationStatus(): boolean {
		if (this.authorizationService.getAuthorizationStatus()) {
			if (!this.userDisplayedList.length > 0) {
				this.getPopularUsers();
			}
			return true;
		}
	}
}
