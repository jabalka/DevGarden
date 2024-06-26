import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IAuthState } from './reducers';

export const selectUserState = createFeatureSelector<IAuthState>('auth');

export const selectCurrentUser = createSelector(
  selectUserState,
  (state: IAuthState) => state.currentUser
);

export const selectUserError = createSelector(
  selectUserState,
  (state: IAuthState) => state.error
);

