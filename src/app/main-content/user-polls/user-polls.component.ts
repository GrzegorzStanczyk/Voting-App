import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Poll, AppState, UserDeletePollAction, GetUserPollsAction, DisconnectFromPollAction } from 'app/app.component.rx';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-polls',
  templateUrl: './user-polls.component.html',
  styleUrls: ['./user-polls.component.scss']
})
export class UserPollsComponent implements OnInit, OnDestroy {
  private userPollsSubscription: Subscription;
  private rooms: string[];
  userPolls$: Observable<Poll[]>;
  collapse: boolean[] = [];

  constructor(private store: Store<AppState>) {
    this.userPolls$ = store.pipe(select(state => state.voteApp.userPolls), filter(r => !!r));
    this.userPollsSubscription = this.userPolls$.subscribe(polls => this.rooms = polls.map(p => p._id));
   }

  ngOnInit() {
    this.store.dispatch(new GetUserPollsAction());
  }

  deletePoll(poll: Poll) {
    this.store.dispatch(new UserDeletePollAction(poll));
  }

  trackByFn(index: number, poll: Poll) {
    return poll._id;
  }

  ngOnDestroy() {
  this.userPollsSubscription.unsubscribe();
  if (this.rooms) {
    this.rooms.forEach(room => this.store.dispatch(new DisconnectFromPollAction(room)));
    }
  }

}
