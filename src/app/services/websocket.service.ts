import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'environments/environment';
import { Poll } from '../app.component.rx';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: SocketIOClient.Socket;
  private newPollAddedSource = new Subject<Poll>();

  newPollAdded$: Observable<Poll> = this.newPollAddedSource.asObservable();

  constructor() { 
    this.socket = io(environment.URL);
    this.socket.on('new-poll-added', data => {
      console.log(data);
      this.newPollAddedSource.next(data);
    });
    this.socket.on('news', data => {
      console.log(data);
    });
  }

  AddNewPoll(poll: Poll) {
    console.log('poll: ', poll);
    this.socket.emit('add-new-poll', poll);
  }

  SendVote() {

  }


}
