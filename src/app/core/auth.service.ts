import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { IAuthUserState } from '../+store/auth';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { IUser, UserModel } from '../user/user.model';
import { authenticate, login, logout, register } from '../+store/auth/actions';
import { authReducer } from '../+store/auth/reducers';
import { NavigationService } from './navigation.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

  private currentUserSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel |  null>(null);
  // currentUser$ = this.currentUserSubject.asObservable();
  currentUser$ = this.store.select((state) => state.auth.currentUser);
  isLogged$ = this.currentUser$.pipe(map(currentUser => !!currentUser));
  isReady$ = this.currentUser$.pipe(map(currentUser => currentUser !== undefined));
  currentUser: UserModel = {} as UserModel;

  constructor(
    private http: HttpClient,
    private store: Store<IAuthUserState>,
    private navigationService: NavigationService,
  ) { 
    this.currentUser$.pipe(
      switchMap((user: IUser | UserModel | null) => {
        if (user){
          if('username' in user){
            this.currentUser = {...user} as UserModel;
          } else {
            const updatedUser: UserModel = {
              _id: user._id,
              email: user.email,
              hashedPassword: user.hashedPassword,
              username: user.email.split('@')[0],
              name: '',
              phone: '',
              profilePicture: ''
          };
          this.currentUser = updatedUser;
          }
        }
        this.currentUserSubject.next(this.currentUser);
        return of(user);
      })
    ).subscribe();
  }

  ngOnInit(): void {

  }

  verifyPass(data: any): Observable<any> {
    return this.http.post(apiUrl + 'user/verify', data);
  }

  login(data: any): Observable<any> {
    return this.http.post<UserModel>(apiUrl + 'user/login', data, {withCredentials: true}).pipe(
      tap((user: UserModel) => {
        this.store.dispatch(login({user}));
      })
    );
  };

  register(data: any): Observable<any> {
    return this.http.post<UserModel>(apiUrl + 'user/register', data, {withCredentials: true}).pipe(
      tap((user: UserModel) => {
        this.store.dispatch(register({ user}));

      })
    );
  };

  logout(): Observable<any> {
    return this.http.get(apiUrl + 'user/logout', {withCredentials: true}).pipe(
      tap(() => {
        this.store.dispatch(logout());
        this.navigationService.clearHistory();
      })
    );
  }

  authenticate(): Observable<any> {
    return this.http.get<UserModel>(apiUrl + 'user/profile', {withCredentials: true}).pipe(
      tap((user: UserModel) => {
        this.store.dispatch(authenticate({user}));
        this.currentUserSubject.next(user);
      }),
      catchError((error) => {
        if(error.status === 401){
          this.store.dispatch(authenticate({ user: null }));
          this.currentUserSubject.next(null);
        } else {
          this.store.dispatch(authenticate({user: null}));
        }
        return of(null);
      })
    )
  }
}
