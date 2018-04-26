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

const ACTION = 'ACTION';

class FirstAction implements Action {
  readonly type = ACTION;
}

export type AppActions = FirstAction;

export function appReducer(state: VoteApp = initialState, action: AppActions) {
  switch (action.type) {
    case ACTION :
    return state = state;

    default:
    return state;
  }
}


