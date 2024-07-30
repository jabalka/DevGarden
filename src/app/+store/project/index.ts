import { ActionReducer, ActionReducerMap } from "@ngrx/store";

import {
    ProjectState,
    projectReducer} from './reducers';
import { IAppState } from "..";

export interface IProjectState {
    readonly project: ProjectState;
};

// export interface ProjectModuleState extends IAppState {
//     project: IProjectState;
// };


export const reducers: ActionReducerMap<IProjectState> = {
    project: projectReducer
};