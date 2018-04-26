import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VoteComponent } from './vote/vote.component';
import { PollComponent } from './poll/poll.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ResultComponent } from './result/result.component';
import { UserPollsComponent } from './user-polls/user-polls.component';
import { MainContentRoutingModule } from './main-content-routing.module';

@NgModule({
  declarations: [
    VoteComponent,
    PollComponent,
    FeedbackComponent,
    ResultComponent,
    UserPollsComponent
  ],
  imports: [
    CommonModule,
    MainContentRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MainContentModule { }
