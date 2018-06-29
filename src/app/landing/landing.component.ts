import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
	model: any = {};

	constructor() {}

	ngOnInit() {}

	onSubmit() {
		alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model));
	}
}
