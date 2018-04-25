import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PollComponent } from './poll/poll.component';
import { ResultComponent } from './result/result.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserPollsComponent } from './user-polls/user-polls.component';
import { VoteComponent } from './vote/vote.component';

export const mainRoutes: Routes = [
  { path: 'vote', component: VoteComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'poll', component: PollComponent },
  { path: 'result', component: ResultComponent },
  { path: 'user-polls', component: UserPollsComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(mainRoutes) ],
  exports: [ RouterModule ]
})
export class MainContentRoutingModule { }
