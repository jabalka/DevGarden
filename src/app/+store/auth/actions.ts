import { createAction, props } from '@ngrx/store';
import { IUser, UserModel } from '../../user/user.model';


const authNamespace = `[AUTH]`;

export const login = createAction(`${authNamespace} Login`, props<{ user: UserModel }>());
export const register = createAction(`${authNamespace} Register`, props<{ user: UserModel }>());
export const logout = createAction(`${authNamespace} Logout`);
export const clearUserData = createAction(`${authNamespace} Clear User Data`);
export const authenticate = createAction(`${authNamespace} Authenticate`, props<{ user: UserModel | null }>());
export const updateUser = createAction(`${authNamespace} Update User`, props<{ user: UserModel }>());
export const setUser = createAction(`${authNamespace} Set User`);
export const setUserSuccess = createAction(`${authNamespace} Set User`, props<{ user: UserModel }>());
export const setUserFailure = createAction(`${authNamespace} Set User Failure`, props<{ error: any }>());

