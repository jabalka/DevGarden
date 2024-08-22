import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { IUser, UserModel } from '../../user/user.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../../+store';
import { selectCurrentUser, selectProjectState } from '../../+store/selectors';
import { projectSetEditMode } from '../../+store/project/actions';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.css'
})
export class ProjectEditComponent implements OnInit, OnDestroy {

  form: FormGroup;
  project!: Project;
  isOwner: boolean = false;
  currentUser?: IUser | null;
  currentUser$?: Observable<UserModel | IUser | null>;
  inEditMode$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private store: Store<IAppState>,
    private route: ActivatedRoute,
  ) { 
    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
    // this.inEditMode$ = this.store.select(state => state.project.isEditMode);
    this.inEditMode$ = this.store.pipe(select(selectProjectState), select(state => state.project.isEditMode))

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      language: ['', Validators.required],
      code: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2500)]],
    });
  }

  ngOnInit(): void {
    this.loadProject();
  }

  loadProject(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if(projectId){
      this.projectService.getProjectById(projectId).subscribe(
        (response: Project) => {
          this.project = response;
          this.form.patchValue({
            title: this.project.title,
            description: this.project.description,
            language: this.project.language,
            code: this.project.code
          });
        },
        error => console.error('Error fetching project:', error)
      );
    }


  }

  submitHandler(): void {

  }

  cancelEdit(): void {

  }

  ngOnDestroy(): void {
    this.store.dispatch(projectSetEditMode({ isEdit: false }));
  }
}
