import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubService } from '../github.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	public username;
	constructor(
		private route: ActivatedRoute,
		private gitHubService: GithubService
	) {}

	ngOnInit() {
		this.getUser();
	}

	getUser() {
		this.username = this.route.snapshot.paramMap.get('username');
	}
}
