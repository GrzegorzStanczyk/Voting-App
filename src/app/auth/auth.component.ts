import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, UserSingUpAction } from '../app.component.rx';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
    private store: Store<AppState>) { }

  ngOnInit() {
  }

  signUp() {
    this.store.dispatch(new UserSingUpAction());
  }

}
