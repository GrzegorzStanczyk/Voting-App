import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'environments/environment';
import { Poll, User, SignUp } from '../app.component.rx';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: SocketIOClient.Socket;
  private newPollAddedSource = new Subject<string>();
  private newUserAddedSource = new Subject<User>();
  private userSignedInSource = new Subject<User>();
  private checkAuthenticationSource = new Subject<User>();
  private pollReceivedSource = new Subject<Poll>();
  private messageFromServerSource = new Subject<string>();
  private userPollsReceivedSource = new Subject<any>();

  newPollAdded$: Observable<string> = this.newPollAddedSource.asObservable();
  newUserAdded$: Observable<User> = this.newUserAddedSource.asObservable();
  userSignedIn$: Observable<User> = this.userSignedInSource.asObservable();
  checkAuthentication$: Observable<User> = this.checkAuthenticationSource.asObservable();
  pollReceived$: Observable<Poll> = this.pollReceivedSource.asObservable();
  messageFromServer$: Observable<string> = this.messageFromServerSource.asObservable();
  userPollsReceived$: Observable<any> = this.userPollsReceivedSource.asObservable();

  constructor() {
    this.socket = io(environment.URL);

    this.socket.on('new-poll-added', data => {
      console.log('NEW POLL ADDED', data);
      this.newPollAddedSource.next(data);
    });

    this.socket.on('new-user-added', data => {
      console.log('NEW USER ADDED');
      this.newUserAddedSource.next();
    });

    this.socket.on('user-login-success', user => {
      console.log('USER SIGNED IN');
      this.userSignedInSource.next(user);
    });

    this.socket.on('authenticated', user => {
      console.log('USER AUTHENTICATED');
      this.checkAuthenticationSource.next(user);
    });

    this.socket.on('connected to poll', poll => {
      console.log('CONNECTED TO POLL: ', poll);
      this.pollReceivedSource.next(poll);
    });

    this.socket.on('message', message => {
      console.log('REJECT FROM SERVER: ', message);
      this.messageFromServerSource.next(message);
    });

    this.socket.on('user_polls', data => {
      console.log('GET USER POLLS', data);
      this.userPollsReceivedSource.next(data);
    });

    this.socket.on('new vote', poll => {
      console.log('FROM ROOM', poll);
      this.pollReceivedSource.next(poll);
    });

    this.socket.on('delete poll success', () => {
      console.log('DELETE SUCCESS');
      const token = localStorage.getItem('jwt_voting-app');
      this.getUserPolls(token);
    });
  }

  addNewPoll(poll: Poll, token: string) {
    console.log('USER SEND NEW POLL: ', poll);
    this.socket.emit('add-new-poll', poll, token);
  }

  addNewUser(user: SignUp) {
    console.log('ADD NEW USER');
    this.socket.emit('add-new-user', user);
  }

  signInUser(user: SignUp) {
    console.log('SIGN IN USER');
    this.socket.emit('sign-in-user', user);
  }

  checkAuthentication() {
    const token = localStorage.getItem('jwt_voting-app');
    if (!!token) {
      console.log('CHECK_AUTHENTICATION');
      this.socket.emit('check-authentication', token);
    }
  }

  connectToPoll(url: string) {
    console.log('CONNECTING TO POLL', url);
    this.socket.emit('connect to poll', url);
  }

  getUserPolls(token: string) {
    console.log('GET USER POLLS');
    this.socket.emit('get_user_polls', token);
  }

  disconnectFormPoll(url: string) {
    console.log('DISCONNECT FROM POLL');
    this.socket.emit('disconnect from poll', url);
  }

  sendVote(payload) {
    console.log('USER VOTE: ', payload);
    this.socket.emit('vote', payload);
  }

  deletePoll(poll: Poll) {
    console.log('USER DELETE POLL: ', poll);
    this.socket.emit('delete poll', poll);
  }
}
