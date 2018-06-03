import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsComponent } from '../credits/credits.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CreditsComponent
  ],
  declarations: [
    CreditsComponent
  ]
})
export class CoreModule { }
