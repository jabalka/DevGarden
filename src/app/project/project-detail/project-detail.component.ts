import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project, ProjectResponse } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { IUser, UserModel } from '../../user/user.model';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, first, of, switchMap } from 'rxjs';
import { loadOwner, loadOwnerSuccess } from '../../+store/owner/actions';
import { IAppState } from '../../+store';
import { selectProjectOwner } from '../../+store/owner/selectors';
import { selectCurrentUser } from '../../+store/selectors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { projectSetEditMode, projectSetErrorMessage, projectSetLoading } from '../../+store/project/actions';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDelDialogComponent } from '../../core/project-del-dialog copy/project-del-dialog.component';
import { UserService } from '../../user/user.service';
// import { ObjectId } from 'mongodb';
import { ObjectId } from 'bson';
import { NavigationService } from '../../core/navigation.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css', '../../../styles.css'],
})
export class ProjectDetailComponent implements OnInit, OnDestroy{

  project!: Project;
  totalProjects!: number;
  ownerTotalProjects!: Project[];
  projectOwner : UserModel = {} as UserModel;
  projectOwnerSubscription?: Subscription;
  isOwner: boolean = false;
  currentUser?: IUser | null;
  currentUser$?: Observable<UserModel | IUser | null>;
  projectSubscription?: Subscription;
  inEditMode$: Observable<boolean>;
  form: FormGroup;
  errorMessage: string = '';
  isHiddenWindow: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private navigationService: NavigationService,
    private router: Router,
    private store: Store<IAppState>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService,
  ){

    this.inEditMode$ = this.store.select(state => state.project.isEditMode);
    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      language: ['', Validators.required],
      code: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2500)]],
    });
    }

    ngOnInit(): void {
      this.loadProjectAndVerifyOwner();

    }
  
    loadProjectAndVerifyOwner(): void {
      const projectId = this.route.snapshot.paramMap.get('id');
      if (projectId) {
        this.projectSubscription = this.projectService.getProjectById(projectId).pipe(
          switchMap((response: ProjectResponse) => {
            this.project = response.project;
            this.ownerTotalProjects = response.projects;
            this.totalProjects = response.totalProjects;
            this.updateFormWithProject();
            this.getOwner();
            return this.currentUser$ || of(null);
          })
        ).subscribe(user => {
          if (user) {
            this.currentUser = user;
            this.verifyOwner();
          } else {
            this.isOwner = false;
          }
        },
        error => console.error('Error fetching project or user:', error));
      }
    }
  
    verifyOwner(): void {
      if (this.project && this.currentUser) {
        this.isOwner = this.project.owner === this.currentUser._id;
      }
    }
  
    ngOnDestroy(): void {
      if (this.projectOwnerSubscription) {
        this.projectOwnerSubscription.unsubscribe();
      }
      if (this.projectSubscription) {
        this.projectSubscription.unsubscribe();
      }
      this.store.dispatch(projectSetEditMode({ isEdit: false }));
    }
  
    getOwner() {
      const ownerId = this.project.owner.toString();
      this.store.dispatch(loadOwner({ userId: ownerId }));
      this.userService.getUser(ownerId).subscribe(
        (owner) => {
          if(owner){
            this.store.dispatch(loadOwnerSuccess({ owner: owner}));
            Object.assign(this.projectOwner, owner);
            if(!owner.username){
              this.projectOwner.username = owner.email.split('@')[0].slice(0,1).toUpperCase() + owner.email.split('@')[0].slice(1);
            }
          }
        },
        (error) => {
            console.error('Error fetching owner:', error)}
      );
    }
  
    deleteProject(): void {
        this.projectService.deleteProject((this.project._id).toString()).subscribe(
          () => {
            this.totalProjects--;
            const previousUrl = this.navigationService.getPreviousUrl();
            this.router.navigate([previousUrl]);
          },
          error => {
            console.error('Error deleting project:', error);
          }
        );
    };
  
    toggleEditMode(): void {
      this.inEditMode$.pipe(first()).subscribe(isEditMode => {
        this.store.dispatch(projectSetEditMode({isEdit: !isEditMode}));
      });
    }
  
    goBack() {
      const previousUrl = this.navigationService.getPreviousUrl();
      this.router.navigate([previousUrl]);
    }

    updateHandler(): void {
      const data = this.form.value;
      this.store.dispatch(projectSetLoading({ isLoading: true }));
      this.projectService.updateProject((this.project._id).toString(), data).subscribe({
        next: () => {
          this.store.dispatch(projectSetEditMode({ isEdit: false}));
          this.store.dispatch(projectSetLoading({ isLoading: false}));
          this.loadProjectAndVerifyOwner();
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'An error occurred while updating the project.';
          this.store.dispatch(projectSetErrorMessage({ message: this.errorMessage }));
          this.store.dispatch(projectSetLoading({ isLoading: false }));
        }
      })
    }
  
    cancelEdit(): void {
      this.toggleEditMode();
    }

    private updateFormWithProject(): void {
      this.form.patchValue({
        title: this.project.title,
        description: this.project.description,
        language: this.project.language,
        code: this.project.code,
      })
    }

    openConfirmDialog(): void {
      this.isHiddenWindow = true;
      const dialogRef = this.dialog.open(ProjectDelDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteProject();
        } else {
          // maybe some extra functionality can be added
          this.isHiddenWindow = false;
        }
      })
    }

    openPublisherAccount(): void {
      const publisherId = this.projectOwner._id;
      this.router.navigate(['/publisher', publisherId]);
    }
}
