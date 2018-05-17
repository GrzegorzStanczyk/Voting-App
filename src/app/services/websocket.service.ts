import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'environments/environment';
import { Poll, User } from '../app.component.rx';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: SocketIOClient.Socket;
  private newPollAddedSource = new Subject<Poll>();
  private newUserAddedSource = new Subject<User>();
  private pollReceivedSource = new Subject<Poll>();

  newPollAdded$: Observable<Poll> = this.newPollAddedSource.asObservable();
  newUserAdded$: Observable<User> = this.newUserAddedSource.asObservable();
  pollReceived$: Observable<Poll> = this.pollReceivedSource.asObservable();

  constructor() {
    this.socket = io(environment.URL);
    this.socket.on('new-poll-added', data => {
      console.log('new-poll-added', data);
      this.newPollAddedSource.next(data);
    });
    this.socket.on('new-user-added', data => {
      console.log('new-user-added', data);
      this.newUserAddedSource.next(data);
    });
    this.socket.on('connected', data => {
      console.log('CONNECTED', data);
    });
    this.socket.on('poll', poll => this.pollReceivedSource.next(poll));

    this.socket.on('user_polls', data => console.log('GET USER POLLS', data));
    this.socket.emit('get_user_polls', null);
  }

  AddNewPoll(poll: Poll) {
    console.log('Add new poll: ', poll);
    this.socket.emit('add-new-poll', poll);
  }

  AddNewUser(user: User) {
    console.log('Add new user: ', user);
    this.socket.emit('add-new-user', user);
  }

  getPoll(url: string) {
    this.socket.emit('get-poll', url);
  }

  SendVote() {

  }


}
