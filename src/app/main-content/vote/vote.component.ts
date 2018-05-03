import { WebsocketService } from 'app/services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState, UserAddNewPoll, Poll } from 'app/app.component.rx';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {
  form: FormGroup;
  items: any = [];
  authorName$: Observable<string>;
  authorName: string;
  private socket: any;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    private websocketService: WebsocketService) {
    this.authorName$ = this.store.pipe(select(state => state.voteApp.user.name));
   }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      items: this.fb.array([ this.createItem(), this.createItem() ])
    });
    this.items = this.form.get('items') as FormArray;
    this.authorName$.pipe(take(1)).subscribe(n => this.authorName = n);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const { title, items } = this.form.value;
    const newPoll: Poll = {
      title,
      author: this.authorName,
      sum: 0,
      fields: items.map(i => ({name: i, votes: 0}))
    };
    this.store.dispatch(new UserAddNewPoll(newPoll));
    this.websocketService.AddNewPoll();
    
    // this.router.navigate(['/result']);
  }

  createItem(): FormControl {
    return new FormControl('', Validators.required);
  }

  addItem() {
    this.items.push(this.createItem());
  }

}
