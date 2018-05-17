import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Poll, AppState } from '../../app.component.rx';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnDestroy {
  result$: Observable<Poll>;
  routerSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private webSocketService: WebsocketService) {
    this.result$ = store.pipe(select(state => state.voteApp.poll));
    this.routerSubscription = this.route.queryParams.subscribe(r => this.webSocketService.getPoll(r.poll));
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
