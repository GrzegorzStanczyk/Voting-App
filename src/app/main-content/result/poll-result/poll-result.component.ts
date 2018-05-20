import { Component, OnInit, Input } from '@angular/core';
import { Poll, AppState } from 'app/app.component.rx';
import { environment } from 'environments/environment';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-result',
  templateUrl: './poll-result.component.html',
  styleUrls: ['./poll-result.component.scss']
})
export class PollResultComponent implements OnInit {
  @Input() result: Poll;
  delayFlag: boolean = false;
  url: string = environment.BASE_URL;

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => this.delayFlag = true);
  }

  goVote(url: string) {
    this.router.navigate(['/poll-vote'], { queryParams: {poll: url} });
  }

}
