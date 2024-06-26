import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { IAuthUserState } from '../+store/auth';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { IUser, UserModel } from '../user/user.model';
import { authenticate, login, logout, register } from '../+store/auth/actions';
import { authReducer } from '../+store/auth/reducers';

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
    private store: Store<IAuthUserState>
  ) { }

  login(data: any): Observable<any> {
    return this.http.post<UserModel>(apiUrl + 'user/login', data, {withCredentials: true}).pipe(
      tap((user: UserModel) => this.store.dispatch(login({user})))
    );
  };

  register(data: any): Observable<any> {
    return this.http.post<UserModel>(apiUrl + 'user/register', data, {withCredentials: true}).pipe(
      tap((user: UserModel) => this.store.dispatch(register({ user})))
    );
  };

  logout(): Observable<any> {
    return this.http.get(apiUrl + 'user/logout', {withCredentials: true}).pipe(
      tap(() => this.store.dispatch(logout()))
    );
  }

  authenticate(): Observable<any> {
    return this.http.get<UserModel>(apiUrl + 'user/profile', {withCredentials: true}).pipe(
      tap((user: UserModel) => this.store.dispatch(authenticate({user}))),
      catchError((error) => {
        if(error.status === 401){
          this.store.dispatch(authenticate({ user: null }));
        } else {
          console.log('auth.service., ln51 - Authentication error:', error)
          this.store.dispatch(authenticate({user: null}));
        }
        return of(null);
      })
    )
  }
}
