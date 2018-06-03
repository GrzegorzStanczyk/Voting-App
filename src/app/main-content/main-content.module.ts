import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NewPollComponent } from './new-poll/new-poll.component';
import { PollVoteComponent } from './poll-vote/poll-vote.component';
import { ResultComponent } from './result/result.component';
import { UserPollsComponent } from './user-polls/user-polls.component';
import { PollResultComponent } from './result/poll-result/poll-result.component';
import { MainContentComponent } from './main-content.component';

import { MainContentRoutingModule } from './main-content-routing.module';

@NgModule({
  declarations: [
    NewPollComponent,
    PollVoteComponent,
    ResultComponent,
    UserPollsComponent,
    PollResultComponent,
    MainContentComponent
  ],
  imports: [
    CommonModule,
    MainContentRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MainContentModule { }
