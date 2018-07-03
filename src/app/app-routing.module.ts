import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
	{ path: ':username', component: UserComponent },
	{ path: '', component: LandingComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	declarations: []
})
export class AppRoutingModule {}
