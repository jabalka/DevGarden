import {createReducer, on} from '@ngrx/store';
import { loadOwnerFailure, loadOwnerSuccess } from './actions';
import { IUser, UserModel } from '../../user/user.model';

export interface IOwnerState {
    projectOwner: UserModel | null;
    error: any;
}

export const initialState: IOwnerState = {
    projectOwner: null,
    error: null
};

const setProjectOwner = (
    state: IOwnerState,
    action: ReturnType<typeof loadOwnerSuccess> 

) => {
    return {...state, projectOwner: action.owner};
}

export const ownerReducer = createReducer<IOwnerState>(
    initialState,
    on(loadOwnerSuccess, setProjectOwner),
    on(loadOwnerFailure, (state, action) => ({...state, error: action.error}))

)