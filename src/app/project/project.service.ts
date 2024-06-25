import { Injectable } from '@angular/core';
import { Project, ProjectResponse } from './project.model';
import { HttpClient } from '@angular/common/http';
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

  getProjects(page: number, pageSize: number): Observable<ProjectResponse> {
    const url = `${apiUrl}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<ProjectResponse>(url);
  }

  getProjectById(id: string): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(apiUrl + id);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(apiUrl, project);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(apiUrl + project._id, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(apiUrl + id);
  }
}
