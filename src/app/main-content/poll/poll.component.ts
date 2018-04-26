import { VoteApp, UserVoteAction } from './../../app.component.rx';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

import { Store, select, State } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Poll, AppState } from '../../app.component.rx';
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
    this.pollForm = new FormGroup({
      poll: new FormControl()
    });
  }

  onSubmit() {
    this.store.dispatch(new UserVoteAction(this.pollForm.get('poll').value));
  }
}
