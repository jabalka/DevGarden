import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadOwner } from '../+store/owner/actions';
import { authenticate, clearUserData, logout, updateUser } from '../+store/auth/actions';
import { ObjectId } from 'mongodb';

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

  updateProfile(data:any): Observable<any>{
    return this.http.put<any>(apiUrl + 'profile', data, {withCredentials: true}).pipe(
      tap((user: any) => this.store.dispatch(updateUser({user})))
    );
  }

  deleteUser(userId: ObjectId): Observable<any> {
    return this.http.delete<any>(apiUrl + 'profile/' + userId, {withCredentials: true}).pipe(
      tap(() => {
        this.store.dispatch(clearUserData());
      })
    );
  }
  
}
