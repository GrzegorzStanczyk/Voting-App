import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Poll, AppState, UserDeletePollAction, GetUserPollsAction } from 'app/app.component.rx';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-polls',
  templateUrl: './user-polls.component.html',
  styleUrls: ['./user-polls.component.scss']
})
export class UserPollsComponent implements OnInit {
  userPolls$: Observable<Poll[]>;
  collapse: boolean[] = [];

  constructor(private store: Store<AppState>) {
    this.userPolls$ = store.pipe(select(state => state.voteApp.userPolls));
   }

  ngOnInit() {
    this.store.dispatch(new GetUserPollsAction());
  }

  deletePoll(poll: Poll) {
    this.store.dispatch(new UserDeletePollAction(poll));
  }

}
