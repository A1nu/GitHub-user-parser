import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LandingComponent } from './landing/landing.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GithubService } from './github.service';
import { CookieService } from 'ngx-cookie-service';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

@NgModule({
	declarations: [AppComponent, LandingComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		ReactiveFormsModule,
		FormsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
	],
	providers: [GithubService, CookieService],
	bootstrap: [AppComponent]
})
export class AppModule {}
