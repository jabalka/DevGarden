import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { updateUser } from '../+store/actions';
import { ProjectService } from '../project/project.service';

const apiUrl = environment.apiUrl + 'user/';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private store: Store,
    private projectService: ProjectService,
  ) { }

  getUser(userId: string){
    //     return this.http.get<ProjectResponse>(url);
    return this.http.get<any>(apiUrl + userId, {withCredentials: true}).pipe(
      tap((user: any) => this.store.dispatch(updateUser({user})))
    )
  }

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
