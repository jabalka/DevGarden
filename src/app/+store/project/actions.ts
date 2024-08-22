import {createAction, props} from '@ngrx/store';

const projectNamespace = '[Project]';
export const projectSetLoading = createAction(`${projectNamespace} SET LOADING`, props<{ isLoading: boolean}>());
export const projectSetEditMode = createAction(`${projectNamespace} SET EDIT MODE`, props<{ isEdit: boolean}>());
export const projectSetErrorMessage = createAction(`${projectNamespace} SET ERROR MESSAGE`, props<{ message: string}>());


