import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadOwner } from '../+store/owner/actions';
import { authenticate, clearUserData, logout, updatePic, updateUser } from '../+store/auth/actions';
import { ObjectId } from 'bson';

export const apiUrl = environment.apiUrl + 'user/';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private profilePicChangeSubject = new BehaviorSubject<string | null>(null);
  profilePicChange$ = this.profilePicChangeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private store: Store,
  ) { }

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const user = localStorage.getItem('currentUser');
    if(user){
      const parsedUser = JSON.parse(user)
      const token = parsedUser.accessToken;
      headers = headers.set('x-authorization', token);
    }
    return headers;
  }

  // ************************************************************
  getUser(userId: string){
    //     return this.http.get<ProjectResponse>(url);
    return this.http.get<any>(apiUrl + userId, { withCredentials: true});
  }

  // ************************************************************
  updateProfile(data:any, file: File | null): Observable<any>{
    const formData = new FormData();
      for(const key in data){
      if(data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    if(file){
      formData.append('profilePicture', file);
    }
    return this.http.put<any>(apiUrl + 'profile', formData, {headers: this.createHeaders(), withCredentials: true}).pipe(
      tap((user: any) => {
        this.store.dispatch(updateUser({user}));
        const newProfilePicUrl = `${environment.apiUrl}uploads/profilePics/${user.profilePicture}`; // here may arise problem with the URL
        this.profilePicChangeSubject.next(newProfilePicUrl);
      })
    );
  }

  // ************************************************************
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(apiUrl + 'profile/' + userId, {headers: this.createHeaders(), withCredentials: true}).pipe(
      tap(() => {
        this.store.dispatch(clearUserData());
      })
    );
  }
  
}
  // ************************************************************

  // this.store.dispatch(loadOwner({userId})))
  
  // updateProfile(userId: string, data:any): Observable<any>{
  //   return this.http.put<any>(apiUrl + userId, data, {withCredentials: true}).pipe(
  //     tap((user: any) => this.store.dispatch(updateUser({user})))
  //   );
  // }

  // updateProfileWithPic(profileData: any, file?: File): Observable<any> {
  //   const formData = new FormData();

  //   // appending profile data
  //   for(const key in profileData){
  //     if(profileData.hasOwnProperty(key)) {
  //       formData.append(key, profileData[key]);
  //     }
  //   }

  //   // appending file if exists
  //   if(file) {
  //     formData.append('profilePicture', file);
  //   }

  //   return this.http.put<any>(`${apiUrl}/profile`, formData, {headers: this.createHeaders(), withCredentials: true}).pipe(
  //     tap((user: any) => {
  //       this.store.dispatch(updateUser({user}));
  //       this.store.dispatch(updatePic({user}));
  //     })
  //   )
  // }

  // ************************************************************

  // uploadProfilePicture(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('profilePicture', file);
  //   return this.http.put<any>(apiUrl + 'profile-picture', formData, {headers: this.createHeaders(), withCredentials: true}).pipe(
  //     tap((user: any) => { 
  //       this.store.dispatch(updatePic({user}));
  //       const newProfilePicUrl = `${environment.apiUrl}uploads/profilePics/${user.profilePicture}`; // here may arise problem with the URL
  //       this.profilePicChangeSubject.next(newProfilePicUrl);
  //     })
  //   );
  // }