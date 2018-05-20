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
  private newPollAddedSource = new Subject<string>();
  private newUserAddedSource = new Subject<User>();
  private pollReceivedSource = new Subject<Poll>();
  private messageFromServerSource = new Subject<string>();

  newPollAdded$: Observable<string> = this.newPollAddedSource.asObservable();
  newUserAdded$: Observable<User> = this.newUserAddedSource.asObservable();
  pollReceived$: Observable<Poll> = this.pollReceivedSource.asObservable();
  messageFromServer$: Observable<string> = this.messageFromServerSource.asObservable();

  constructor() {
    this.socket = io(environment.URL);

    this.socket.on('new-poll-added', data => {
      console.log('NEW POLL ADDED', data);
      this.newPollAddedSource.next(data);
    });

    this.socket.on('new-user-added', data => {
      console.log('new-user-added', data);
      this.newUserAddedSource.next(data);
    });

    this.socket.on('connected to poll', poll => {
      console.log('CONNECTED TO POLL: ', poll);
      this.pollReceivedSource.next(poll);
    });

    this.socket.on('message', message => {
      console.log('REJECT FROM SERVER: ', message);
      this.messageFromServerSource.next(message);
    });

    this.socket.on('user_polls', data => console.log('GET USER POLLS', data));
    this.socket.emit('get_user_polls');

    this.socket.on('new vote', poll => {
      console.log('FROM ROOM', poll);
      this.pollReceivedSource.next(poll);
    });
  }

  AddNewPoll(poll: Poll) {
    console.log('USER SEND NEW POLL: ', poll);
    this.socket.emit('add-new-poll', poll);
  }

  AddNewUser(user: User) {
    console.log('ADD NEW USER: ', user);
    this.socket.emit('add-new-user', user);
  }

  connectToPoll(url: string) {
    console.log('CONNECTING TO POLL', url);
    this.socket.emit('connect to poll', url);
  }

  disconnectFormPoll(url: string) {
    console.log('DISCONNECT FROM POLL');
    this.socket.emit('disconnect from poll', url);
  }

  SendVote(payload) {
    console.log('USER VOTE: ', payload);
    this.socket.emit('vote', payload);
  }
}
