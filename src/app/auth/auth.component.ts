import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, UserLogOutnAction, User } from '../app.component.rx';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  @Input() user: User;
  constructor(private store: Store<AppState>) { }

  logOut() {
    this.store.dispatch(new UserLogOutnAction());
  }
}
