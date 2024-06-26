import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadOwner } from '../+store/owner/actions';
import { updateUser } from '../+store/auth/actions';

const apiUrl = environment.apiUrl + 'user/';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private store: Store,
  ) { }

  getUser(userId: string){
    //     return this.http.get<ProjectResponse>(url);
    return this.http.get<any>(apiUrl + userId, {withCredentials: true})
  }
  // this.store.dispatch(loadOwner({userId})))
  
  // updateProfile(userId: string, data:any): Observable<any>{
  //   return this.http.put<any>(apiUrl + userId, data, {withCredentials: true}).pipe(
  //     tap((user: any) => this.store.dispatch(updateUser({user})))
  //   );
  // }

  updateProfile(userId: string, data:any): Observable<any>{
    return this.http.put<any>(apiUrl + 'profile', data, {withCredentials: true}).pipe(
      tap((user: any) => this.store.dispatch(updateUser({user})))
    );
  }
  
}
