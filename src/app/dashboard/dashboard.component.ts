import { Component, Input } from '@angular/core';
import { User } from 'app/app.component.rx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() user: User;

  constructor() {}

}
