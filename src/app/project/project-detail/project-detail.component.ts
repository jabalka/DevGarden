import { Component, OnInit } from '@angular/core';
import { Project, ProjectResponse } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { UserService } from '../../user/user.service';
import { IUser, UserModel } from '../../user/user.model';
import { AuthService } from '../../core/auth.service';
import { State, Store, select } from '@ngrx/store';
import { IRootState } from '../../+store';
import { Observable } from 'rxjs';
import { selectCurrentUser } from '../../+store/selectors';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit{

  project!: Project;
  totalProjects!: number;
  ownerTotalProjects!: Project[];
  owner: UserModel = {} as UserModel;
  isOwner: boolean = false;
  currentUser$: Observable<IUser | null | undefined>;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private state: State<IUser>,
    private store: Store<IRootState>
  ){
    this.currentUser$ = this.store.pipe(select(selectCurrentUser))
  }

  ngOnInit(): void {
    this.getProject();
    this.currentUser$.subscribe(user => {
      if(user){
        this.verifyOwner(user._id.toString());
      }
    })
   
  }

  getProject(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.projectService.getProjectById(id).subscribe(
        (response: ProjectResponse) => {
          this.project = response.project,
          this.ownerTotalProjects = response.projects,
          this.totalProjects = response.totalProjects,
           this.getOwner();

        },
      error => console.error('Error fetching project:', error));
    }
  }

  verifyOwner(userId: string){
    console.log('ln 65: userId:', userId)
    this.isOwner = this.project.owner.toString() === userId;
    console.log('ln 67: isOwner:', this.isOwner)

  }   

  //   verifyOwner(projectId: string, userId: string){
  //   this.project._id

  //   this.authService.authenticate().subscribe(user => {
  //     console.log('project-detail ln 51:', user)
  //     if(user !== null){
  //       this.projectService.getProjectById(projectId).subscribe(project => {
  //         this.isOwner = project.project.owner.toString() === user._id;
  //         console.log(` project-detail ln57., Is owner: ${this.isOwner}`);
  //       });
  //     } else {
  //       console.log(` project-detail ln61., Is owner: ${this.isOwner}`);
  //     }
      
  //   });
  // }   

  
  getOwner() {
    const ownerId = this.project.owner.toString();
    this.userService.getUser(ownerId).subscribe(
      (user: UserModel) => {
        Object.assign(this.owner, user)
        // get just the first part of the email to use as greeting------
        this.owner.username = user.email.split('@')[0];
      },
      error => console.error('Error fetching owner:', error)
    );
  }

  deleteProject(projectId: string): void {
    this.projectService.deleteProject(projectId).subscribe(
      () => {
        this.totalProjects--;
        console.log('Project deleted successfully');
      },
      error => {
        console.error('Error deleting project:', error);
      }
    )
  };

  navigateToEditProject(projectId: string) : void {
    this.router.navigate(['/projects/edit/', projectId]);
  }
}
