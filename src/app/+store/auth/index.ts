// StoreModule.forRoot({ count: counterReducer }

import { ActionReducerMap } from '@ngrx/store';
import { authReducer, IAuthState } from './reducers';

export interface IAuthUserState {
  auth: IAuthState;
}

export const reducers: ActionReducerMap<IAuthUserState> = {
  auth: authReducer
};

