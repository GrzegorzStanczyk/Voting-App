import { VoteApp, UserVoteAction } from 'app/app.component.rx';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Poll, AppState } from 'app/app.component.rx';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {
  poll$: Observable<Poll>;
  pollForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.poll$ = store.pipe(select(state => state.voteApp.poll));
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
    this.store.dispatch(new UserVoteAction(this.pollForm.get('poll').value));
  }
}
