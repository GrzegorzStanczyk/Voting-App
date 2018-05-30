import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, UserLogOutnAction } from '../app.component.rx';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  constructor(
    private store: Store<AppState>) { }

  logOut() {
    this.store.dispatch(new UserLogOutnAction());
  }
}
