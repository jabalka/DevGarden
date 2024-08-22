import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { of, switchMap } from 'rxjs';
import { UserModel } from '../../user/user.model';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.css'
})
export class NewProjectComponent implements OnInit {

  form: FormGroup;

  currentUser$ = this.authService.currentUser$;
  currentUser: UserModel = {} as UserModel;
  errorMessage: string = ''


  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      language: ['', Validators.required],
      code: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2500)]]
    });
  }

  ngOnInit(): void {
    this.currentUser$.pipe(
      switchMap((user: UserModel | null) => {
        if (user){
          this.currentUser = user;
          }     
        return of(user);
      })
    ).subscribe();
  }

  submitHandler(): void {
    const project = this.form.value;
    this.projectService.createProject(project).subscribe({
      next: () => {
        this.router.navigate(['/my-projects']);
      },
      error: (err) => {
        this.errorMessage = err.error.message.replace(/\n/g, '<br>');
        console.error('Problem with creating a new project', err)
      }
    })
  }

  cancelCreate(): void {
    const cancelConfirmed = confirm('Are you sure you want to cancel therefore all your progress will be lost?')
    if(cancelConfirmed){
      this.router.navigate(['/projects']);
    }
  }
}
