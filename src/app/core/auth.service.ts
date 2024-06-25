import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { IRootState } from '../+store';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { IUser, UserModel } from '../user/user.model';
import { authenticate, login, logout, register } from '../+store/actions';
import { authReducer } from '../+store/reducers';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel |  null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  // currentUser$ = this.store.select((state) => state.auth.currentUser);
  isLogged$ = this.currentUser$.pipe(map(currentUser => !!currentUser));
  isReady$ = this.currentUser$.pipe(map(currentUser => currentUser !== undefined));

  constructor(
    private http: HttpClient,
    private store: Store<IRootState>
  ) { }

  login(data: any): Observable<any> {
    return this.http.post<IUser>(apiUrl + 'user/login', data, {withCredentials: true}).pipe(
      tap((user: IUser) => this.store.dispatch(login({user})))
    );
  };

  register(data: any): Observable<any> {
    return this.http.post<IUser>(apiUrl + 'user/register', data, {withCredentials: true}).pipe(
      tap((user: IUser) => this.store.dispatch(register({ user})))
    );
  };

  logout(): Observable<any> {
    return this.http.get(apiUrl + 'user/logout', {withCredentials: true}).pipe(
      tap(() => this.store.dispatch(logout()))
    );
  }

  authenticate(): Observable<any> {
    return this.http.get<IUser>(apiUrl + 'user/profile', {withCredentials: true}).pipe(
      tap((user: IUser) => this.store.dispatch(authenticate({user}))),
      catchError(() => {
        this.store.dispatch(authenticate({user: null}));
        return of(null);
      })
    )
  }
}
