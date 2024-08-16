import { createReducer, on } from '@ngrx/store';
import { authenticate, clearUserData, login, logout, register, setUser, setUserFailure, setUserSuccess, updatePic, updateUser } from './actions';
import { IUser, UserModel } from '../../user/user.model';
import { ObjectId } from 'bson';
// AUTH STATE AND REDUCERS ---------------------
export interface IAuthState {
    currentUser: UserModel | null;
    error: any;
}

export const initialState: IAuthState = {
    currentUser: null,
    error: null
};

const setCurrentUser = (
    state: IAuthState,
    action: ReturnType<typeof login> |
     ReturnType<typeof register> |
     ReturnType<typeof setUserSuccess>
) => {
    const newState = {...state, currentUser: action.user, error: null};
    localStorage.setItem('authState', JSON.stringify(newState));
    localStorage.setItem('currentUser', JSON.stringify(action.user));
    return  newState;
}

const updateCurrentUser = (
    state: IAuthState,
    action: ReturnType<typeof updateUser>
) => {
    localStorage.removeItem('authState');
    localStorage.removeItem('currentUser');
    const newState = {...state, currentUser: action.user, error: null};
    if(!localStorage.getItem('authState') && !localStorage.getItem('currentUser')){
        localStorage.setItem('authState', JSON.stringify(newState));
        localStorage.setItem('currentUser', JSON.stringify(action.user));
        return newState;
    }
   return state;
}

const updateProfilePic = (
    state: IAuthState,
    action: ReturnType<typeof updatePic>
): IAuthState => {
    const { profilePicture } = action.user;
    
    // Ensure the entire user object is updated correctly.
    const updatedUser = {
        _id: state.currentUser?._id || new ObjectId(),
        email: state.currentUser?.email || '',
        hashedPassword: state.currentUser?.hashedPassword || '',
        username: state.currentUser?.username || '',
        name: state.currentUser?.name || '',
        phone: state.currentUser?.phone || '',
        profilePicture: profilePicture || '' // Ensure `profilePicture` is a string
    };
    const newState = {
        ...state,
        currentUser: updatedUser,
        error: null
    };

    localStorage.setItem('authState', JSON.stringify(newState));
    localStorage.setItem('currentUser', JSON.stringify(newState.currentUser));

    return newState;
};

const authenticateUser = (
    state: IAuthState,
    action: ReturnType<typeof authenticate>
) => {
    const storedState = localStorage.getItem('authState');
    if(storedState){
        const parsedState = JSON.parse(storedState);
        if(parsedState.currentUser){
            return {...state, currentUser: parsedState.currentUser, error: null};
        }
    }
    return {...state, currentUser:null, error: null}; 
}

const clearUser = (
    state: IAuthState,
    action: ReturnType<typeof clearUserData> |
    ReturnType<typeof logout> 
) => {
    localStorage.removeItem('authState');
    localStorage.removeItem('currentUser');
    return {...state, currentUser: null, error: null};
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
    on(setUserSuccess, setCurrentUser),
    on(updateUser, updateCurrentUser),
    on(updatePic, updateProfilePic),
    on(authenticate, authenticateUser),
    on(logout, clearUser),
    on(clearUserData, clearUser),
    on(setUserFailure, (state, {error}) => {
        const newState = {...state, error};
        localStorage.setItem('authState', JSON.stringify(newState))
        return newState;
    }),

)


