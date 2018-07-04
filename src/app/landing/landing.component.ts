import { Component, OnInit } from '@angular/core';
import { GithubService } from '../services/github.service';
import { AuthorizationService } from '../services/authorization.service';
import { LocalStorage, LocalStorageService } from 'ngx-store';

@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
	public contentLoading = false;
	public model: any = {};
	public userDisplayedList = [];
	public searchName: string;
	public lastSearches = [];
	public firstLoad = true;
	public tiled: boolean;
	public logged: boolean;

	private mostPopularUserQuery: string =
		'query SearchMostPopular($queryString: String!) {\n' +
		'  search(query: $queryString, type: USER, first: 10) {\n' +
		'    userCount\n' +
		'    nodes {\n' +
		'      ... on User {\n' +
		'        __typename\n' +
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

	constructor(
		private gitHubService: GithubService,
		private authorizationService: AuthorizationService,
		private localStorageService: LocalStorageService
	) {}

	ngOnInit() {
		this.getLastSearches();
		this.getAuthorizationStatus();
	}

	onSubmit(): void {
		const username = this.model.username;
		const queryVariables = `{ "queryString": "${username}" }`;

		this.localStorageService.set('searchKey', queryVariables);
		this.localStorageService.set('username', username);
		this.searchName = username;
		this.setLastSearch(username);
		this.getUsers(this.mostPopularUserQuery, queryVariables);
	}

	redirectToUrl(url: string): void {
		const a = document.createElement('a');

		document.body.appendChild(a);
		a.setAttribute('style', 'display: none;');
		a.setAttribute('target', '_blank');
		a.href = url;

		a.click();
		a.remove();
	}

	sortByNameLength(data: any): any {
		return data.sort((a, b) => {
			return a.name.length - b.name.length;
		});
	}

	getUsers(query: string, variables: string): void {
		this.contentLoading = true;
		this.gitHubService
			.requestData(query, variables)
			.then((data) => {
				this.userDisplayedList = data['data']['search']['nodes'];
				this.contentLoading = false;
			})
			.catch((err) => {
				this.contentLoading = false;
				console.log(err);
			});
	}

	getAuthorizationStatus(): boolean {
		if (this.authorizationService.getAuthorizationStatus()) {
			this.loadContent();
			return true;
		}
	}

	loadContent(): void {
		if (
			!(this.userDisplayedList.length > 0) &&
			!this.contentLoading &&
			this.firstLoad
		) {
			const query = this.mostPopularUserQuery;
			const searchKey = this.localStorageService.get('searchKey');
			this.getUsers(query, searchKey);
			this.searchName = this.localStorageService.get('username');
			this.model = { username: this.searchName };
			this.firstLoad = false;
			this.logged = true;
		}
	}

	setLastSearch(key: string): void {
		this.lastSearches = this.localStorageService.get('lastSearches');
		if (this.lastSearches == null) {
			this.lastSearches = [];
		}
		if (this.lastSearches != null && this.lastSearches.length > 2) {
			this.lastSearches.shift();
			this.lastSearches.push(key);
		} else {
			this.lastSearches.push(key);
		}
		this.localStorageService.set('lastSearches', this.lastSearches);
	}

	getLastSearches(): void {
		const storageData = this.localStorageService.get('lastSearches');
		if (storageData != null) {
			this.lastSearches = this.localStorageService.get('lastSearches');
		}
	}

	sortSearches(data: any[]): any[] {
		return data.sort((a, b) => {
			return a.length - b.length;
		});
	}

	isEmptyRequest(obj: object): boolean {
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}

	repeatSearch(username: string): void {
		const queryVariables = `{ "queryString": "${username}" }`;
		this.searchName = username;
		this.getUsers(this.mostPopularUserQuery, queryVariables);
	}
}
