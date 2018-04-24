import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoteComponent } from './vote.component';
import { PollComponent } from './poll/poll.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ResultComponent } from './result/result.component';
import { UserPollsComponent } from './user-polls/user-polls.component';

@NgModule({
  declarations: [
    VoteComponent,
    PollComponent,
    FeedbackComponent,
    ResultComponent,
    UserPollsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VoteComponent,
    PollComponent,
    FeedbackComponent,
    ResultComponent,
    UserPollsComponent
  ]
})
export class VoteModule { }
