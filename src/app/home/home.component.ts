import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ProjectService } from '../project/project.service';
import { Router } from '@angular/router';
import { NavigationService } from '../core/navigation.service';
import { Project, ProjectResponse } from '../project/project.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',

})
export class HomeComponent implements OnInit{
  projects: Project[] = [];
  totalProjects: number = 0;

  constructor(    
    private projectService: ProjectService,
    // private router: Router,
    // private navigationService: NavigationService,
  ){
    this.projects = [];
  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
    this.projectService.getProjectsNoPagination().subscribe(
      (response: ProjectResponse) => {
        this.projects = response.projects;
        this.totalProjects = response.totalProjects;
      },
      error => {
        console.error('Error fetching projects:', error);
      }
    );
  }
}
