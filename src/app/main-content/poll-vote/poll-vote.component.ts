import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoteApp, UserVoteAction } from 'app/app.component.rx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Poll, AppState } from 'app/app.component.rx';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-poll-vote',
  templateUrl: './poll-vote.component.html',
  styleUrls: ['./poll-vote.component.scss']
})
export class PollVoteComponent implements OnInit, OnDestroy {
  poll$: Observable<Poll>;
  pollForm: FormGroup;
  pollSubscription: Subscription;
  poll: Poll;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.poll$ = store.pipe(select(state => state.voteApp.poll));
    this.pollSubscription = this.poll$.subscribe(p => this.poll = p);
   }

  ngOnInit() {
    this.pollForm = this.fb.group({
      poll: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.pollForm.get('poll').invalid) {
      return;
    }
    const payload = { index: this.pollForm.get('poll').value, poll: this.poll };
    console.log('this.poll: ', this.poll);
    this.store.dispatch(new UserVoteAction(payload));
  }

  ngOnDestroy() {
    this.pollSubscription.unsubscribe()
  }
}
