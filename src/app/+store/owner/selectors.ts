import {createSelector, createFeatureSelector} from '@ngrx/store';
import { IOwnerState } from './reducers';

export const selectOwnerState = createFeatureSelector<IOwnerState>('owner');

export const selectProjectOwner = createSelector(
    selectOwnerState,
    (state: IOwnerState) => state.projectOwner
);

export const selectOwnerError = createSelector(
    selectOwnerState,
    (state: IOwnerState) => state.error
);