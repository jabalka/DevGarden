import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project, ProjectResponse } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { IUser, UserModel } from '../../user/user.model';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, first, of, switchMap } from 'rxjs';
import { loadOwner } from '../../+store/owner/actions';
import { IAppState } from '../../+store';
import { selectProjectOwner } from '../../+store/owner/selectors';
import { selectCurrentUser } from '../../+store/selectors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { projectSetEditMode, projectSetErrorMessage, projectSetLoading } from '../../+store/project/actions';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDelDialogComponent } from '../../core/project-del-dialog copy/project-del-dialog.component';

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
    private router: Router,
    private store: Store<IAppState>,
    private fb: FormBuilder,
    private dialog: MatDialog,
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
            this.getOwner();
            this.updateFormWithProject();
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
      this.projectOwnerSubscription = this.store.pipe(select(selectProjectOwner))
        .subscribe(
          (owner: UserModel | null) => {
            if (owner) {
              Object.assign(this.projectOwner, owner);
              // get just the first part of the email to use as greeting------
              this.projectOwner.username = owner.email.split('@')[0];
            }
          },
          error => console.error('Error fetching owner:', error)
        );
    }
  
    deleteProject(): void {
        this.projectService.deleteProject((this.project._id).toString()).subscribe(
          () => {
            this.totalProjects--;
            this.router.navigate(['/projects']);
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
      this.router.navigate(['/projects']);
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
          this.errorMessage = err.error.message;
          this.store.dispatch(projectSetErrorMessage({ message: err.error.message }));
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
}
