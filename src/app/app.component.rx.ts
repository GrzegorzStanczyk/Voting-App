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
      ]
    },
    {
      title: 'Who is your hero?',
      author: 'Janek',
      fields: [
        { name: 'Batman', votes: 20 },
        { name: 'Superman', votes: 40 },
        { name: 'Captain America', votes: 20 }
      ]
    },
    {
      title: 'Who is your hero?',
      author: 'Janek',
      fields: [
        { name: 'Batman', votes: 20 },
        { name: 'Superman', votes: 40 },
        { name: 'Captain America', votes: 20 }
      ]
    }
  ],
  poll: {
    title: 'Who is your hero?',
    author: 'Janek',
    fields: [
      { name: 'Batman', votes: 20 },
      { name: 'Superman', votes: 40 },
      { name: 'Captain America', votes: 20 }
    ]
  }
};

const USER_VOTE_ACTION = 'USER_VOTE_ACTION';

export class UserVoteAction implements Action {
  readonly type = USER_VOTE_ACTION;

  constructor(public payload: string) {}
}

export type AppActions =
  | UserVoteAction;

export function appReducer(state: VoteApp = initialState, action: AppActions) {
  switch (action.type) {
    case USER_VOTE_ACTION :
      const vote = state.poll.fields.map(v => v.name === action.payload ? {name: v.name, votes: ++v.votes} : v);
      state = {...state, poll: {...state.poll, fields: vote}};
  }
  return state;
}
