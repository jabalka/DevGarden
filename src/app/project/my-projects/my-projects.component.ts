import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';
import { UserModel } from '../../user/user.model';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.css',
})
export class MyProjectsComponent implements OnInit {
  projects: Project[] = [];
  totalProjects: number = 0;
  currentPage: number = 0;
  pageSize: number = 2;
  currentUser: UserModel = {} as UserModel;
  currentUser$ = this.authService.currentUser$;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.currentPage = 1;
    this.currentUser$.subscribe(
      (user) => {
        Object.assign(this.currentUser, user);
        this.getUserProjects(this.currentPage);
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.totalProjects / this.pageSize);
  }

  getUserProjects(page: number): void {
    this.projectService.getOwnerProjects((this.currentUser._id).toString(), page, this.pageSize).subscribe(
      
      (response) => {
        this.projects = response.projects;
        this.totalProjects = response.totalProjects;
        this.currentPage = page;
      },
      error => {
        console.error('Error fetching projects:', error);
      }
    )
  }

  navigateToDetail(projectId: string): void {
    this.router.navigate(['/projects/', projectId]);
  }
  
  goToCreate(): void {
    this.router.navigate(['/projects/new']);
  }

  goToNextPage(): void {
    if (this.currentPage * this.pageSize < this.totalProjects){
      this.getUserProjects(this.currentPage + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1){
      this.getUserProjects(this.currentPage - 1);
    }
  }
}
