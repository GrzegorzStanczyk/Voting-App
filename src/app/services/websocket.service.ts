import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'environments/environment';


@Injectable()
export class WebsocketService {
  private socket: any;

  constructor() { 
    this.socket = io(environment.URL);
    this.socket.on('news', data => {
      console.log(data);
    });
    this.socket.on('poll', data => {
      console.log(data);
    });
  }

  AddNewPoll() {
    this.socket.emit('event', { my: 'data'});
  }

  SendVote() {

  }


}
