import { Injectable } from '@angular/core';
import { Project, ProjectResponse } from './project.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const apiUrl = environment.apiUrl + 'projects/';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
    
  constructor(
    private http: HttpClient,
  ) { }

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const user = localStorage.getItem('currentUser');
    if(user){
      const parsedUser = JSON.parse(user)
      const token = parsedUser.accessToken;
      // headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('x-authorization', token);
    }
    return headers;
  }

  getProjects(page: number, pageSize: number): Observable<ProjectResponse> {
    const url = `${apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<ProjectResponse>(url);
  }

  getOwnerProjects(ownerId: string, page: number, pageSize: number): Observable<ProjectResponse> {
    const url = `${apiUrl}?_ownerId=${ownerId}&page=${page}&pageSize=${pageSize}`;
    return this.http.get<ProjectResponse>(url, {headers: this.createHeaders(), withCredentials: true});
  }

  getProjectsByOwner(ownerId: string): Observable<any> {
    return this.http.get<any>(apiUrl + 'projects/' + ownerId , {headers: this.createHeaders(), withCredentials: true})
  }

  getProjectById(id: string): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(apiUrl + id);
  }


  createProject(project: Project): Observable<Project> {
    const headers = this.createHeaders();
    return this.http.post<Project>(apiUrl, project, {headers: this.createHeaders(), withCredentials: true});
  }

  updateProject(projectId: string, project: Project): Observable<Project> {
    return this.http.put<Project>(apiUrl + projectId, project, {headers: this.createHeaders(), withCredentials: true});
  }

  updateToAdminOwnership(projectId: string, project: Project): Observable<Project> {
    return this.http.put<Project>(apiUrl + 'adminOwned/' + projectId, project, {headers: this.createHeaders(), withCredentials: true});
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(apiUrl + id, {headers: this.createHeaders(), withCredentials: true});
  }
}
