import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IAuthState } from './auth/reducers';
import { IOwnerState } from './owner/reducers';
import { IProjectState } from './project';

export const selectUserState = createFeatureSelector<IAuthState>('auth');
export const selectOwnerState = createFeatureSelector<IOwnerState>('owner');
export const selectProjectState = createFeatureSelector<IProjectState>('project');


export const selectCurrentUser = createSelector(
  selectUserState,
  (state: IAuthState) => state.currentUser
);

export const selectUserError = createSelector(
  selectUserState,
  (state: IAuthState) => state.error
);

export const selectProjectOwner = createSelector(
  selectOwnerState,
  (state: IOwnerState) => state.projectOwner
);

export const selectOwnerError = createSelector(
  selectOwnerState,
  (state: IOwnerState) => state.error
);

export const selectProject = createSelector(
  selectProjectState,
  (state: IProjectState) => state.project
)

