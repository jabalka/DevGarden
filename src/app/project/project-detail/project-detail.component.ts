import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Project, ProjectResponse } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { UserService } from '../../user/user.service';
import { IUser, UserModel } from '../../user/user.model';
import { AuthService } from '../../core/auth.service';
import { State, Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadOwner } from '../../+store/owner/actions';
import { IAppState } from '../../+store';
import { selectProjectOwner } from '../../+store/owner/selectors';
import { selectCurrentUser } from '../../+store/auth/selectors';
import { setUser } from '../../+store/auth/actions';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent implements OnInit, OnDestroy{

  project!: Project;
  totalProjects!: number;
  ownerTotalProjects!: Project[];
  projectOwner : UserModel = {} as UserModel;
  projectOwnerSubscription?: Subscription;
  isOwner: boolean = false;
  currentUser?: IUser | null;
  currentUserSubscription?: Subscription;

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private projectService: ProjectService,
    @Inject(Router) private router: Router,
    private store: Store<IAppState>
  ){

    // this.projectOwner = this.store.pipe(select(selectProjectOwner));
    // this.currentUser$ = this.store.pipe(select(selectCurrentUser));
    }

  ngOnInit(): void {
    this.getProject();
    this.currentUserSubscription = this.store.pipe(select(selectCurrentUser))
    .subscribe(user => {
      if(user){
        this.store.dispatch(setUser());
        console.log("this.currentUser$ ln43:")
        this.currentUser = user;
        this.verifyOwner(user._id.toString());
      } else {
        this.isOwner = false;
      }
    });
    console.log('projectOwner:', this.projectOwner, '\n', 'currentUser:', this.currentUser, '\n', 'isOwner:', this.isOwner)

    // this.authService.authenticate().subscribe(user => {
    //   if(user){
    //     this.currentUser$ = user;
    //     console.log("this.currentUser$ ln43:",this.currentUser$)
    //     this.verifyOwner(user._id.toString());
    //   } else {
    //     this.isOwner = false;
    //   }
    // })


      
    // this.currentUser$.subscribe(user => {
    //   console.log("ln50:", user)
    //   if(user){
    //     this.verifyOwner(user._id.toString());
    //   } else {
    //     this.isOwner = false;
    //   }
    // })
   
  }

  ngOnDestroy(): void {
    if(this.currentUserSubscription){
      this.currentUserSubscription.unsubscribe();
    }
    if(this.projectOwnerSubscription){
      this.projectOwnerSubscription.unsubscribe();
    }
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

  verifyOwner(userId: string): void {
    if (this.project) {
        this.isOwner = this.project.owner.toString() === userId;
        console.log('project-detail --ln107-- User ID:', userId);
        console.log('project-detail --ln108-- Project Owner:', this.project.owner.toString());
        console.log('project-detail --ln109-- Is Owner:', this.isOwner);
    }
}
 

  
  getOwner() {
    const ownerId = this.project.owner.toString();
    this.store.dispatch(loadOwner({userId : ownerId}));
    this.projectOwnerSubscription = this.store.pipe(select(selectProjectOwner))
    .subscribe(
      (owner: UserModel | null) => {
        if(owner){
          Object.assign(this.projectOwner, owner)
                   // get just the first part of the email to use as greeting------
            this.projectOwner.username = owner.email.split('@')[0];
        }
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
