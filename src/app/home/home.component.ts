import { Component } from '@angular/core';
import { ProjectService } from '../project/project.service';
import { Router } from '@angular/router';
import { NavigationService } from '../core/navigation.service';
import { Project, ProjectResponse } from '../project/project.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  projects: Project[] = [];
  totalProjects: number = 0;
  currentPage: number = 0;
  pageSize: number = 2;

  constructor(    
    private projectService: ProjectService,
    private router: Router,
    private navigationService: NavigationService,
  ){
    this.projects = [];
  }

  getProjects(page: number): void {
    this.projectService.getProjects(page, this.pageSize).subscribe(
      (response: ProjectResponse) => {
        this.projects = response.projects;
        this.totalProjects = response.totalProjects;
        this.currentPage = page;
        this.navigationService.setCurrentPage(page); // this may need to be deleted to refresh the page everytime enter again here
      },
      error => {
        console.error('Error fetching projects:', error);
      }
    );
  }
}
