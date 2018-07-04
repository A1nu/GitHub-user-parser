import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LandingComponent } from './landing/landing.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GithubService } from './services/github.service';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { UserComponent } from './user/user.component';
import { AuthorizationService } from './services/authorization.service';
import { WebStorageModule } from 'ngx-store';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

@NgModule({
	declarations: [AppComponent, LandingComponent, UserComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		ReactiveFormsModule,
		FormsModule,
		NgxPaginationModule,
		WebStorageModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		AppRoutingModule
	],
	providers: [
		HttpClient,
		GithubService,
		CookieService,
		LandingComponent,
		AuthorizationService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
