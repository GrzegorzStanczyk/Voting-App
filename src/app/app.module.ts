import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { VoteModule } from './vote/vote.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { appReducer } from './app.component.rx';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { CreditsComponent } from './credits/credits.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

import { environment } from '../environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AppRoutingModule } from './/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    CreditsComponent,
    SignUpComponent,
    DashboardComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    VoteModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot({ reducers: appReducer }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
