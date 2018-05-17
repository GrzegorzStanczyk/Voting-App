import { WebsocketService } from 'app/services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState, UserAddNewPoll, Poll } from 'app/app.component.rx';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-poll',
  templateUrl: './new-poll.component.html',
  styleUrls: ['./new-poll.component.scss']
})
export class NewPollComponent implements OnInit {
  form: FormGroup;
  items: any = [];
  // authorName$: Observable<string>;
  // authorName: string;
  private socket: any;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder) {
    // this.authorName$ = this.store.pipe(select(state => state.voteApp.user.name));
   }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      items: this.fb.array([ this.createItem(), this.createItem() ])
    });
    this.items = this.form.get('items') as FormArray;
    // this.authorName$.pipe(take(1)).subscribe(n => this.authorName = n);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const { title, items } = this.form.value;
    const newPoll = {
      title,
      fields: items.map(i => ({name: i}))
    };
    this.store.dispatch(new UserAddNewPoll(newPoll));
  }

  createItem(): FormControl {
    return new FormControl('', Validators.required);
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  trackByFn(index: number, item) {
    return item;
  }

}
