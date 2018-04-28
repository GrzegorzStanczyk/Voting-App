import { Action } from '@ngrx/store';
import { Store, select } from '@ngrx/store';

export interface Field {
  name: string;
  votes: number;
}
export interface Poll {
  title: string;
  author: string;
  fields: Field[];
  sum: number;
}
export interface User {
  name: string;
}
export interface VoteApp  {
  user: User;
  userPolls: Poll[];
  poll: Poll;
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
  }
};

const USER_VOTE_ACTION = 'USER_VOTE_ACTION';
const USER_DELETE_POLL = 'USER_DELETE_POLL';
const USER_ADD_NEW_POLL = 'USER_ADD_NEW_POLL';

export class UserVoteAction implements Action {
  readonly type = USER_VOTE_ACTION;

  constructor(public payload: string) {}
}

export class UserDeletePollAction implements Action {
  readonly type = USER_DELETE_POLL;

  constructor(public payload: number) {}
}

export class UserAddNewPoll implements Action {
  readonly type = USER_ADD_NEW_POLL;

  constructor(public payload: Poll) {}
}

export type AppActions =
  | UserVoteAction
  | UserDeletePollAction
  | UserAddNewPoll;

export function appReducer(state: VoteApp = initialState, action: AppActions) {
  switch (action.type) {
    case USER_VOTE_ACTION :
      const vote = state.poll.fields.map(v => v.name === action.payload ? {name: v.name, votes: ++v.votes} : v);
      const sum = vote.reduce((a,b) => a + b.votes, 0);
      state = {...state, poll: {...state.poll, fields: vote, sum}};
      break;
    case USER_DELETE_POLL :
      state.userPolls.splice(action.payload, 1);
      state = {...state};
      break;
    case USER_ADD_NEW_POLL :
      state.userPolls.push(action.payload);
      state = {...state};
      break;
  }
  return state;
}
