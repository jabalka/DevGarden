import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { UserService } from "../../user/user.service";
import { loadOwner,loadOwnerFailure,loadOwnerSuccess } from "./actions";
import { map, catchError, switchMap} from 'rxjs/operators';
import { of } from "rxjs";

// getUser

@Injectable()
export class OwnerEffects {
    constructor(
        private actions$: Actions,
        private userService: UserService,
    ) {}

    setOwner$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadOwner),
            switchMap(action =>
                this.userService.getUser(action.userId).pipe(
                    map(owner => loadOwnerSuccess({owner})),
                    catchError(error => of(loadOwnerFailure({error})))
                ))
        )
    )
}