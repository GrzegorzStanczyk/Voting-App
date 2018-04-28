import { Component, OnInit, Input } from '@angular/core';
import { Poll } from 'app/app.component.rx';

@Component({
  selector: 'app-poll-result',
  templateUrl: './poll-result.component.html',
  styleUrls: ['./poll-result.component.scss']
})
export class PollResultComponent implements OnInit {
  @Input() result: Poll;
  delayFlag: boolean = false;

  constructor() { }

  ngOnInit() {
    setTimeout(() => this.delayFlag = true);
  }

}
