import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, UserSingInAction } from 'app/app.component.rx';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.createForm();
   }

   createForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.store.dispatch(new UserSingInAction({ email, password}));
  }

}
