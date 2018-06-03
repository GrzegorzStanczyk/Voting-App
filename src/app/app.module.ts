import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MainContentModule } from './main-content/main-content.module';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { appReducer, PollEffects } from './app.component.rx';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AuthComponent } from './auth/auth.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ModalComponent } from './modal/modal.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SignUpComponent,
    NavigationComponent,
    DashboardComponent,
    SpinnerComponent,
    ModalComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot({ voteApp:  appReducer }),
    EffectsModule.forRoot([PollEffects]),
    StoreDevtoolsModule.instrument(),
    AppRoutingModule,
    MainContentModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule
  ],
  entryComponents: [SpinnerComponent, ModalComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
