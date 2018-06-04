import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  exports: [
    AuthComponent,
    SignUpComponent,
    SignInComponent,
    NavigationComponent
  ],
  declarations: [
    AuthComponent,
    SignUpComponent,
    SignInComponent,
    NavigationComponent
  ]
})
export class AuthModule { }
