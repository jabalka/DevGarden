import {createAction, props} from '@ngrx/store';
import { IUser, UserModel } from '../../user/user.model';

const ownerNamespace = `[OWNER]`;

export const loadOwner = createAction(`${ownerNamespace} Load`, props<{ userId: string}>());
export const loadOwnerSuccess = createAction(`${ownerNamespace} Load Success`, props<{ owner: UserModel}>());
export const loadOwnerFailure = createAction(`${ownerNamespace} Load Failure`, props<{ error: any}>());


