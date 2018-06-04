import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MainContentModule } from './main-content/main-content.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';

import { environment } from '../environments/environment';
import { appReducer, PollEffects } from './app.component.rx';

import { AppComponent } from './app.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot({ voteApp:  appReducer }),
    EffectsModule.forRoot([PollEffects]),
    StoreDevtoolsModule.instrument(),
    AppRoutingModule,
    MainContentModule,
    CoreModule,
    AuthModule
  ],
  entryComponents: [SpinnerComponent, ModalComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
