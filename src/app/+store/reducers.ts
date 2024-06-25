import { createReducer, on } from '@ngrx/store';
import { authenticate, login, logout, register, setUser, setUserFailure, setUserSuccess, updateUser } from './actions';
import { IUser } from '../user/user.model';



export interface IAuthState {
    currentUser: IUser | null | undefined;
    error: any;
}

export const initialState: IAuthState = {
    currentUser: undefined,
    error: null
};

const setCurrentUser = (
    state: IAuthState,
    action: ReturnType<typeof login> |
     ReturnType<typeof register> |
     ReturnType<typeof authenticate> |
     ReturnType<typeof updateUser> |
     ReturnType<typeof setUserSuccess>
) => {
    return {...state, currentUser: action.user};
}

export const authReducer = createReducer<IAuthState>(
    initialState,
    // since on all the 3 actions need to be done the same this arrow function
    //  will be taken out and reused for all actions as following above
    // on(login, (state, action) => {
    //     return {...state, currentUser: action.user};
    // })
    on(login, setCurrentUser),
    on(register, setCurrentUser),
    on(authenticate, setCurrentUser),
    on(updateUser, setCurrentUser),
    on(setUserSuccess, setCurrentUser),
    on(logout, (state, action) => {return {...state, setCurrentUser: null}}),
    on(setUserFailure, (state, {error}) => ({...state, error}))

)