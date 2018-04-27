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
        { name: 'Batman', votes: 20 },
        { name: 'Superman', votes: 40 },
        { name: 'Captain America', votes: 20 }
      ],
      sum: 80
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
      const sum = vote.reduce((a,b) => a + b.votes, 0);
      state = {...state, poll: {...state.poll, fields: vote, sum}};
  }
  return state;
}
