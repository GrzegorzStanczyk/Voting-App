import { Component, Input } from '@angular/core';
import { User } from 'app/app.component.rx';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Input() user: User;
  constructor() { }

}
