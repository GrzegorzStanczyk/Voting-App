import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Poll, AppState } from '../../app.component.rx';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {
  result$: Observable<Poll>;

  constructor(private store: Store<AppState>) {
    this.result$ = store.pipe(select(state => state.voteApp.poll));
  }

}
