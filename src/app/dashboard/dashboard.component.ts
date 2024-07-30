import { Component, Inject, OnInit } from '@angular/core';
import { Project, ProjectResponse } from '../project/project.model';
import { Router } from '@angular/router';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';

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
    private userService: UserService,
    @Inject(Router) private router: Router,
  ){
    this.projects = [];

  }

  ngOnInit(): void {
    this.currentPage = 1;
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
      },
      error => {
        console.error('Error fetching projects:', error);
      }
    );
  }
  // deleteProject(projectId: string): void {
  //   this.projectService.deleteProject(projectId).subscribe(
  //     () => {
  //       this.projects = this.projects.filter(project => project._id.toString()!== projectId);
  //       this.totalProjects--;
  //       console.log('Project deleted successfully');
  //     },
  //     error => {
  //       console.error('Error deleting project:', error);
  //     }
  //   )
  // }

  navigateToDetail(projectId: string): void {
    this.router.navigate(['/projects/', projectId])
  }
  // navigateToEditProject(projectId: string) : void {
  //   this.router.navigate(['/projects/', projectId]);
  // }
  
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
