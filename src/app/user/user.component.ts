import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubService } from '../services/github.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	public username: string;
	public loading: boolean;
	public detailedInfoContent = [];
	private userDetailedQuery: string =
		'query getUserInfo($login: String!) {\n' +
		'  user(login: $login) {\n' +
		'  \t__typename\n' +
		'    avatarUrl\n' +
		'    name\n' +
		'    login\n' +
		'    url\n' +
		'    organizations (first: 3) {\n' +
		'      nodes {\n' +
		'        avatarUrl\n' +
		'        name\n' +
		'        url\n' +
		'      }\n' +
		'    }\n' +
		'    repositories (first: 3) {\n' +
		'      nodes {\n' +
		'        name\n' +
		'        url\n' +
		'      }\n' +
		'    }\n' +
		'  }\n' +
		'}';

	constructor(
		private route: ActivatedRoute,
		private gitHubService: GithubService
	) {}

	ngOnInit() {
		this.getUser();
	}

	getUser(): void {
		this.loading = true;
		this.username = this.route.snapshot.paramMap.get('username');
		const userDetailVariables = `{"login": "${this.username}"}`;
		this.gitHubService
			.requestData(this.userDetailedQuery, userDetailVariables)
			.then((data) => {
				this.detailedInfoContent = data['data']['user'];
				this.loading = false;
			});
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
}
