import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Poll, AppState } from '../../app.component.rx';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  result$: Observable<Poll>;
  delayFlag: boolean = false;

  constructor(private store: Store<AppState>) {
    this.result$ = store.pipe(select(state => state.voteApp.poll));
  }

  ngOnInit() {
    this.result$.pipe(first()).subscribe(r => setTimeout(() => this.delayFlag = true));
  }

}
