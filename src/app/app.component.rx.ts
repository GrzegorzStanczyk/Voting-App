import { Injectable } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, mapTo, pluck } from 'rxjs/operators';
import { WebsocketService } from './services/websocket.service';

export interface Field {
  name: string;
  votes?: number;
}
export interface SignUp {
  name?: string;
  email: string;
  password: string;
}

export interface Poll {
  title: string;
  author?: string;
  fields: Field[];
  sum?: number;
  _id?: string;
}
export interface User {
  name: string;
  email?: string;
  _id?: string;
  token?: string;
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
  user: null,
  userPolls: null,
  poll: null,
  pending: false,
  modalMsg: ''
};

const APP_PENDING = 'APP_PENDING';

const USER_VOTE = 'USER_VOTE_ACTION';
const USER_DELETE_POLL = 'USER_DELETE_POLL';
const USER_ADD_NEW_POLL = 'USER_ADD_NEW_POLL';
const GET_USER_POLLS = 'GET_USER_POLLS';
const RECEIVED_USER_POLLS = 'RECEIVED_USER_POLLS';
const USER_SIGN_UP = 'USER_SIGN_UP';
const USER_SIGN_IN = 'USER_SIGN_IN';
const USER_SIGNED_IN = 'USER_SIGNED_IN';
const USER_LOG_OUT = 'USER_LOG_OUT';
const CONNECT_TO_POLL = 'CONNECT_TO_POLL';
const MESSAGE_FROM_SERVER = 'MESSAGE_FROM_SERVER';
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

  constructor(public payload: Poll) {}
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

  constructor(public payload: SignUp) {}
}

export class UserSingInAction implements Action {
  readonly type = USER_SIGN_IN;

  constructor(public payload: SignUp | string) {}
}

export class UserSingedInAction implements Action {
  readonly type = USER_SIGNED_IN;

  constructor(public payload: User) {}
}

export class UserLogOutnAction implements Action {
  readonly type = USER_LOG_OUT;
}

export class PollReceivedAction implements Action {
  readonly type = POLL_RECEIVED;

  constructor(public payload: Poll) {}
}

export class ConnectToPollAction implements Action {
  readonly type = CONNECT_TO_POLL;

  constructor(public payload: string) {}
}

export class MessageFromServerAction implements Action {
  readonly type = MESSAGE_FROM_SERVER;

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

export class GetUserPollsAction implements Action {
  readonly type = GET_USER_POLLS;
}

export class ReceivedUserPollsAction implements Action {
  readonly type = RECEIVED_USER_POLLS;

  constructor(public payload: Poll[]) {}
}

export type AppActions =
  | UserVoteAction
  | UserDeletePollAction
  | UserAddNewPollAction
  | AppPendingAction
  | UserSingUpAction
  | UserSingedInAction
  | UserSingInAction
  | UserLogOutnAction
  | ConnectToPollAction
  | MessageFromServerAction
  | DisconnectFromPollAction
  | PollReceivedAction
  | CloseModalAction
  | NewVoteAction
  | GetUserPollsAction
  | ReceivedUserPollsAction;

export function appReducer(state: VoteApp = initialState, action: AppActions) {
  switch (action.type) {
    case APP_PENDING :
      state = {...state, pending: action.payload};
      break;
    case POLL_RECEIVED :
      state = {...state,
        poll: {...action.payload,
          sum: action.payload.fields.reduce((a, b) => a + b.votes, 0)
        },
        userPolls: state.userPolls.map(p => p._id === action.payload._id
          ? {...action.payload, sum: action.payload.fields.reduce((a, b) => a + b.votes, 0)}
          : p)
      };
      break;
    case RECEIVED_USER_POLLS :
      state = {...state, userPolls: action.payload.map(p => {
        return {
          ...p,
          sum: p.fields.reduce((a, b) => a + b.votes, 0)
        };
      })};
      break;
    case MESSAGE_FROM_SERVER :
      state = {...state, modalMsg: action.payload};
      break;
    case CLOSE_MODAL :
      state = {...state, modalMsg: ''};
      break;
    case USER_SIGNED_IN :
      state = {...state, user: action.payload};
      break;
    case USER_LOG_OUT :
      state = {...state, user: null };
      break;
  }
  return state;
}

@Injectable()

export class PollEffects {

  @Effect()
  onAddPoll$: Observable<AppPendingAction> = this.actions$.pipe(
    ofType(USER_ADD_NEW_POLL),
    pluck('payload'),
    tap((poll: Poll) => {
      const token = localStorage.getItem('jwt_voting-app');
      this.websocketService.addNewPoll(poll, token);
    }),
    mapTo(new AppPendingAction(true))
  );

  @Effect({ dispatch: false})
  onPollAdded$ = this.websocketService.newPollAdded$.pipe(
    tap((pollUrl: string) => this.router.navigate(['/result'], { queryParams: { poll: pollUrl }}))
  );

  @Effect()
  onConnectToPoll$: Observable<AppPendingAction> = this.actions$.pipe(
    ofType(CONNECT_TO_POLL),
    pluck('payload'),
    tap((pollUrl: string) => this.websocketService.connectToPoll(pollUrl)),
    mapTo(new AppPendingAction(true))
  );

  @Effect()
  onGetUserPolls$: Observable<AppPendingAction> = this.actions$.pipe(
    ofType(GET_USER_POLLS),
    tap(() => this.websocketService.getUserPolls()),
    mapTo(new AppPendingAction(true))
  );

  @Effect()
  onUserPollsReceived$: Observable<AppActions> = this.websocketService.userPollsReceived$.pipe(
    map(res => res.user_polls),
    switchMap(polls => [new AppPendingAction(false), new ReceivedUserPollsAction(polls)])
  );

  @Effect({ dispatch: false })
  onDisconnectFromPoll$ = this.actions$.pipe(
    ofType(DISCONNECT_FORM_POLL),
    pluck('payload'),
    tap((pollUrl: string) => this.websocketService.disconnectFormPoll(pollUrl))
  );

  @Effect()
  onMessageFromServer$: Observable<AppActions> = this.websocketService.messageFromServer$.pipe(
    switchMap(msg => [new AppPendingAction(false), new MessageFromServerAction(msg)])
  );

  @Effect()
  onPollReceived$: Observable<AppActions> = this.websocketService.pollReceived$.pipe(
    switchMap(poll => [new AppPendingAction(false), new PollReceivedAction(poll)])
  );

  @Effect({ dispatch: false })
  onUserVote$ = this.actions$.pipe(
    ofType(USER_VOTE),
    pluck('payload'),
    tap(payload => this.websocketService.sendVote(payload))
  );

  @Effect()
  onSignUp$: Observable<UserSingUpAction | AppPendingAction> = this.actions$.pipe(
    ofType(USER_SIGN_UP),
    pluck('payload'),
    tap((data: SignUp) => this.websocketService.addNewUser(data)),
    mapTo(new AppPendingAction(true))
  );

  @Effect()
  onSignIn$: Observable<UserSingInAction | AppPendingAction> = this.actions$.pipe(
    ofType(USER_SIGN_IN),
    pluck('payload'),
    tap((data: SignUp | string) => this.websocketService.signInUser(data)),
    mapTo(new AppPendingAction(true))
  );

  @Effect()
  onSignedIn$: Observable<AppActions> = this.websocketService.userSignedIn$.pipe(
    switchMap(user => {
      localStorage.setItem('jwt_voting-app', user.token);
      this.router.navigate(['/']);
      return [new AppPendingAction(false), new UserSingedInAction(user)];
    })
  );

  @Effect()
  onUserLogOut$: Observable<MessageFromServerAction> = this.actions$.pipe(
    ofType(USER_LOG_OUT),
    mapTo(new MessageFromServerAction('You have been logged out')),
    tap(() => {
      localStorage.removeItem('jwt_voting-app');
      this.router.navigate(['/']);
    })
  );

  @Effect()
  onAddedNewUser$: Observable<AppActions> = this.websocketService.newUserAdded$.pipe(
    mapTo(new AppPendingAction(false)),
    tap(() => this.router.navigate(['/sign-in']))
  );

  @Effect()
  onUserDeletePoll$: Observable<AppPendingAction> = this.actions$.pipe(
    ofType(USER_DELETE_POLL),
    pluck('payload'),
    tap((poll: Poll) => this.websocketService.deletePoll(poll)),
    mapTo(new AppPendingAction(true))
  );

  constructor(
    private actions$: Actions,
    private websocketService: WebsocketService,
    private router: Router,
    private store: Store<AppState>) {}
}
