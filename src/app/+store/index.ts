import {ActionReducerMap} from '@ngrx/store';
import { IOwnerState, ownerReducer } from './owner/reducers';
import { IAuthState, authReducer } from './auth/reducers';

export interface IAppState {
    owner: IOwnerState;
    auth: IAuthState;
}

export const reducers: ActionReducerMap<IAppState> = {
    owner: ownerReducer,
    auth: authReducer,
}