import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AuthComponent } from './auth/auth.component';
import { CreditsComponent } from './credits/credits.component';
import { VoteComponent } from './vote/vote.component';
import { PollComponent } from './vote/poll/poll.component';
import { FeedbackComponent } from './vote/feedback/feedback.component';
import { ResultComponent, } from './vote/result/result.component';
import { UserPollsComponent } from './vote/user-polls/user-polls.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    CreditsComponent,
    VoteComponent,
    PollComponent,
    FeedbackComponent,
    ResultComponent,
    UserPollsComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
