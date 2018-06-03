import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsComponent } from '../credits/credits.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AppRoutingModule } from '../app-routing.module';
import { NavigationComponent } from '../navigation/navigation.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [
    CreditsComponent,
    DashboardComponent
  ],
  declarations: [
    CreditsComponent,
    DashboardComponent
  ]
})
export class CoreModule { }
