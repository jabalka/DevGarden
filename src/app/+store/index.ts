import {ActionReducerMap} from '@ngrx/store';
import { IOwnerState, ownerReducer } from './owner/reducers';
import { IAuthState, authReducer } from './auth/reducers';
import { ILoginState, IProfileState, IRegisterState, loginReducer, profileReducer, registerReducer } from './user/reducers';
import { ProjectState } from './project/reducers';
import { projectReducer } from './project/reducers';

export interface IAppState {
    owner: IOwnerState;
    auth: IAuthState;
    login: ILoginState;
    register: IRegisterState;
    profile: IProfileState;
    project: ProjectState;
}

export const reducers: ActionReducerMap<IAppState> = {
    owner: ownerReducer,
    auth: authReducer,
    login: loginReducer,
    register: registerReducer,
    profile: profileReducer,
    project: projectReducer,
}