// StoreModule.forRoot({ count: counterReducer }

import { ActionReducerMap } from '@ngrx/store';
import { authReducer, IAuthState } from './reducers';

export interface IAuthUserState {
  readonly auth: IAuthState;
  // here my arise an issue since I changed the auth to be readonly*
}

export const reducers: ActionReducerMap<IAuthUserState> = {
  auth: authReducer
};

