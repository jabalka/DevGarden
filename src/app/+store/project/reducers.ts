import {createReducer, on} from '@ngrx/store';
import { 
    projectSetLoading,
    projectSetEditMode,
    projectSetErrorMessage
} from './actions';

export interface ProjectState {
    isEditMode: boolean;
    isLoading: boolean;
    errorMessage: string | null;
};

export const initialProjectState: ProjectState = {
    isEditMode: false,
    isLoading: false,
    errorMessage: null,
};

export const projectReducer = createReducer<ProjectState>(
    initialProjectState,
    on(projectSetEditMode, (state, action) => {
        const isLoading = !action.isEdit ? false : state.isLoading;
        return {...state, isEditMode: action.isEdit, isLoading };
    }),
    on(projectSetLoading, (state, action) => {
        return {...state, isLoading: action.isLoading };
    }),
    on(projectSetErrorMessage, (state, action) => {
        const isLoading = false;
        return {...state, errorMessage: action.message, isLoading}
    })
);
