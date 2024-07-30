import { ActionReducer, ActionReducerMap } from "@ngrx/store";

import {
    ILoginState,
    IProfileState,
    IRegisterState,
    loginReducer,
    profileReducer,
    registerReducer} from './reducers';
import { IAppState } from "..";

export interface IUserState {
    readonly login: ILoginState;
    readonly register: IRegisterState;
    readonly profile: IProfileState;
};

export interface IUserModuleState extends IAppState {
    user: IUserState;
};

export const reducers: ActionReducerMap<IUserState> = {
    login: loginReducer,
    register: registerReducer,
    profile: profileReducer,
};