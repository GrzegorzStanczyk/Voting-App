import { Injectable, OnDestroy } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState, User } from '../app.component.rx';
import { pluck } from 'rxjs-compat/operator/pluck';
import { Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  tokenAvailable: boolean;
  sub: Subscription;
  user$: Observable<User>;

  constructor(private router: Router, private store: Store<AppState>) {
    this.user$ = this.store.pipe(select(state => state.voteApp.user));
    this.sub = this.user$.subscribe(user => this.tokenAvailable = user ? !!user.token : false);
  }

  canActivate(): boolean {
    return this.tokenAvailable ? true : false;
  }

}
