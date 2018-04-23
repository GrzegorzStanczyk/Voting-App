import { Action } from '@ngrx/store';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/observable';

interface AppState  {
  id: number;
}

const initialState: AppState  = {
  id: 1
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


