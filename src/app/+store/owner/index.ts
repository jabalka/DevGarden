import {ActionReducerMap} from "@ngrx/store";
import { IOwnerState, ownerReducer } from "./reducers";

export interface IProjectState {
    owner: IOwnerState;
}

export const reducers: ActionReducerMap<IProjectState> = {
    owner: ownerReducer
};