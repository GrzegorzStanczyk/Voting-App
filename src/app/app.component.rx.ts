import { Action } from '@ngrx/store';
import { Store, select } from '@ngrx/store';

interface Field {
  name: string;
  votes: number;
}
interface Poll {
  title: string;
  fields: Field[];
}

interface AppState  {
  userPolls: Poll[];
  poll: Poll;
}

const initialState: AppState  = {
  userPolls: [
    {
      title: 'Who is your hero?',
      fields: [
        { name: 'Batman', votes: 20 },
        { name: 'Superman', votes: 40 },
        { name: 'Captain America', votes: 20 }
      ]
    },
    {
      title: 'Who is your hero?',
      fields: [
        { name: 'Batman', votes: 20 },
        { name: 'Superman', votes: 40 },
        { name: 'Captain America', votes: 20 }
      ]
    },
    {
      title: 'Who is your hero?',
      fields: [
        { name: 'Batman', votes: 20 },
        { name: 'Superman', votes: 40 },
        { name: 'Captain America', votes: 20 }
      ]
    }
  ],
  poll: {
    title: 'Who is your hero?',
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

export function appReducer(state: AppState  = initialState, action: AppActions) {
  switch (action.type) {
    case ACTION :
    state = state;
    return state;
  }
}


