import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PollComponent } from './vote/poll/poll.component';
import { ResultComponent } from './vote/result/result.component';
import { FeedbackComponent } from './vote/feedback/feedback.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserPollsComponent } from './vote/user-polls/user-polls.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'poll', component: PollComponent },
  { path: 'result', component: ResultComponent },
  { path: 'user-polls', component: UserPollsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
