import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AuthService } from "../../core/auth.service";
import { register, setUser, setUserFailure, setUserSuccess } from "./actions";
import { map, catchError, switchMap} from 'rxjs/operators';
import { of } from "rxjs";


@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService
    ){}

    // register$ = createEffect(() =>
    // this.actions$.pipe(
    //     ofType(register),
    //     switchMap(action => 
    //         this.authService.register(action.user).pipe(
    //             map(user => setUserSuccess({user})),
    //             catchError(error => of(setUserFailure({error})))
    //         )
    //     )
    // ));

    setUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setUser),
            switchMap(() =>
                this.authService.authenticate().pipe(
                    map(user => setUserSuccess({ user})),
                    catchError(error => of(setUserFailure({ error })))
                ))
        )
    );
}
