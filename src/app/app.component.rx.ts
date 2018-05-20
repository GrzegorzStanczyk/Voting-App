import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { WebsocketService } from './services/websocket.service';

export interface Field {
  name: string;
  votes?: number;
}
export interface Poll {
  title: string;
  author?: string;
  fields: Field[];
  sum?: number;
  error?: string;
  _id?: string;
}
export interface User {
  name: string;
}
export interface VoteApp  {
  user: User;
  userPolls: Poll[];
  poll: Poll;
  pending: boolean;
  modalMsg: string;
}
export interface AppState  {
  voteApp: VoteApp;
}

const initialState: VoteApp  = {
  user: {name: 'Oskar'},
  userPolls: [
    {
      title: 'Who is your hero?',
      author: 'Janek',
      fields: [
        { name: 'Batman', votes: 20 },
        { name: 'Superman', votes: 40 },
        { name: 'Captain America', votes: 20 }
      ],
      sum: 80
    },
    {
      title: 'Who is your hero?',
      author: 'Janek',
      fields: [
        { name: 'CatWoman', votes: 100 },
        { name: 'Barbie', votes: 10 },
        { name: 'SuperGirl', votes: 20 }
      ],
      sum: 130
    },
    {
      title: 'Who is your hero?',
      author: 'Janek',
      fields: [
        { name: 'Hulk', votes: 50 },
        { name: 'IronMan', votes: 40 },
        { name: 'Thor', votes: 60 }
      ],
      sum: 140
    }
  ],
  poll: {
    title: 'Who is your hero?',
    author: 'Janek',
    fields: [
      { name: 'Batman', votes: 90 },
      { name: 'Superman', votes: 45 },
      { name: 'Captain America', votes: 5 }
    ],
    sum: 140
  },
  pending: false,
  modalMsg: ''
};

const APP_PENDING = 'APP_PENDING';

const USER_VOTE = 'USER_VOTE_ACTION';
const USER_DELETE_POLL = 'USER_DELETE_POLL';
const USER_ADD_NEW_POLL = 'USER_ADD_NEW_POLL';
// const NEW_POLL_ADDED = 'NEW_POLL_ADDED';
// const POLL_ADDING_ERROR = 'POLL_ADDING_ERROR';
const USER_SIGN_UP = 'USER_SIGN_UP';
const CONNECT_TO_POLL = 'CONNECT_TO_POLL';
const NO_POLL_IN_DB = 'NO_POLL_IN_DB';
const DISCONNECT_FORM_POLL = 'DISCONNECT_FORM_POLL';
const POLL_RECEIVED = 'POLL_RECEIVED';
const CLOSE_MODAL = 'CLOSE_MODAL';
const GO_VOTE = 'GO_VOTE';
const NEW_VOTE = 'NEW_VOTE';

export class UserVoteAction implements Action {
  readonly type = USER_VOTE;

  constructor(public payload: {index: number, poll: Poll}) {}
}

export class UserDeletePollAction implements Action {
  readonly type = USER_DELETE_POLL;

  constructor(public payload: number) {}
}

export class UserAddNewPollAction implements Action {
  readonly type = USER_ADD_NEW_POLL;

  constructor(public payload: Poll) {}
}

export class AppPendingAction implements Action {
  readonly type = APP_PENDING;

  constructor(public payload: boolean) {}
}

export class UserSingUpAction implements Action {
  readonly type = USER_SIGN_UP;
}

export class PollReceivedAction implements Action {
  readonly type = POLL_RECEIVED;

  constructor(public payload: Poll) {}
}

export class ConnectToPollAction implements Action {
  readonly type = CONNECT_TO_POLL;

  constructor(public payload: string) {}
}

export class NoPollInDBAction implements Action {
  readonly type = NO_POLL_IN_DB;

  constructor(public payload: string) {}
}

export class DisconnectFromPollAction implements Action {
  readonly type = DISCONNECT_FORM_POLL;

  constructor(public payload: string) {}
}

export class CloseModalAction implements Action {
  readonly type = CLOSE_MODAL;
}

export class NewVoteAction implements Action {
  readonly type = NEW_VOTE;

  constructor(public payload: Poll) {}
}

export type AppActions =
  | UserVoteAction
  | UserDeletePollAction
  | UserAddNewPollAction
  | AppPendingAction
  | UserSingUpAction
  | ConnectToPollAction
  | NoPollInDBAction
  | DisconnectFromPollAction
  | PollReceivedAction
  | CloseModalAction
  | NewVoteAction;

export function appReducer(state: VoteApp = initialState, action: AppActions) {
  switch (action.type) {
    // case USER_VOTE :
    //   const fields = state.poll.fields.map((v, i) => i === action.payload ? {name: v.name, votes: ++v.votes} : v);
    //   const sum = fields.reduce((a, b) => a + b.votes, 0);
    //   state = {...state, poll: {...state.poll, fields, sum}};
    //   break;
    case USER_DELETE_POLL :
      state.userPolls.splice(action.payload, 1);
      state = {...state};
      break;
    case APP_PENDING :
      state = {...state, pending: action.payload};
      break;
    case POLL_RECEIVED :
      state = {...state, poll: {...action.payload, sum: action.payload.fields.reduce((a, b) => a + b.votes, 0)}};
      break;
    case NO_POLL_IN_DB :
      state = {...state, modalMsg: action.payload};
      break;
    case CLOSE_MODAL :
      state = {...state, modalMsg: ''};
  }
  return state;
}

@Injectable()

export class PollEffects {

  @Effect()
  onAddPoll$: Observable<AppPendingAction> = this.actions$.pipe(
    ofType(USER_ADD_NEW_POLL),
    map((action: UserAddNewPollAction) => action.payload),
    tap((poll: Poll) => this.websocketService.AddNewPoll(poll)),
    map(() => new AppPendingAction(true))
  );

  @Effect({ dispatch: false})
  onPollAdded$ = this.websocketService.newPollAdded$.pipe(
    tap((pollUrl: string) => this.router.navigate(['/result'], { queryParams: { poll: pollUrl }}))
  );

  @Effect()
  onConnectToPoll$: Observable<AppActions> = this.actions$.pipe(
    ofType(CONNECT_TO_POLL),
    map((action: ConnectToPollAction) => action.payload),
    tap(pollUrl => this.websocketService.connectToPoll(pollUrl)),
    map(() => new AppPendingAction(true))
  );

  @Effect({ dispatch: false })
  onDisconnectFromPoll$ = this.actions$.pipe(
    ofType(DISCONNECT_FORM_POLL),
    map((action: DisconnectFromPollAction) => action.payload),
    tap(pollUrl => this.websocketService.disconnectFormPoll(pollUrl))
  );

  @Effect()
  onNoPollInDBS$: Observable<AppActions> = this.websocketService.noPollInDB$.pipe(
    switchMap(msg => [new AppPendingAction(false), new NoPollInDBAction(msg)])
  );

  @Effect()
  onPollReceived$: Observable<AppActions> = this.websocketService.pollReceived$.pipe(
    switchMap(poll => [new AppPendingAction(false), new PollReceivedAction(poll)])
  );

  @Effect({ dispatch: false })
  onUserVote$ = this.actions$.pipe(
    ofType(USER_VOTE),
    map((action: UserVoteAction) => action.payload),
    tap(payload => this.websocketService.SendVote(payload))
  );

  @Effect()
  onSignUp$ = this.actions$.pipe(
    ofType(USER_SIGN_UP),
    tap(() => this.websocketService.AddNewUser({ name: 'Mark' })),
    map(() => new AppPendingAction(true))
  );

  @Effect()
  onAddedNewUser$: Observable<AppActions> = this.websocketService.newUserAdded$.pipe(
    map(() => new AppPendingAction(false)),
    tap(res => this.router.navigate(['/']))
  );

  constructor(
    private actions$: Actions,
    private websocketService: WebsocketService,
    private router: Router) {}
}
