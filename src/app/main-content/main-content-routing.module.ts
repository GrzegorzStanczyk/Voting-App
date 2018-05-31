import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PollVoteComponent } from './poll-vote/poll-vote.component';
import { ResultComponent } from './result/result.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserPollsComponent } from './user-polls/user-polls.component';
import { NewPollComponent } from './new-poll/new-poll.component';
import { AuthGuardService } from '../auth/auth-guard.service';

export const mainRoutes: Routes = [
  { path: 'new-poll', component: NewPollComponent, canActivate: [AuthGuardService] },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'poll-vote', component: PollVoteComponent },
  { path: 'result', component: ResultComponent },
  { path: 'user-polls', component: UserPollsComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forChild(mainRoutes) ],
  exports: [ RouterModule ]
})
export class MainContentRoutingModule { }
