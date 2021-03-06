import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, UserSingUpAction } from 'app/app.component.rx';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.createForm();
   }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      honey: ['', Validators.maxLength(0)]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { name, email, password } = this.form.value;
    this.store.dispatch(new UserSingUpAction({ name, email, password}));
  }

}
