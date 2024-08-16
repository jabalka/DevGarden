import { Component, Inject, OnInit } from '@angular/core';
import { Project, ProjectResponse } from '../project/project.model';
import { Router } from '@angular/router';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { NavigationService } from '../core/navigation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit  {

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

  ngOnInit(): void {
    this.currentPage = this.navigationService.getCurrentPage() || 1;
    this.getProjects(this.currentPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalProjects / this.pageSize);
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

  navigateToDetail(projectId: string): void {
    this.router.navigate(['/projects/', projectId])
  }

  goToNextPage(): void {
    if (this.currentPage * this.pageSize < this.totalProjects){
      this.getProjects(this.currentPage + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1){
      this.getProjects(this.currentPage - 1);
    }
  }

}
