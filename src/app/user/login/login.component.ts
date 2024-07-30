import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IUserModuleState } from '../../+store/user';
import { userLoginSetErrorMessage, userLoginSetLoading } from '../../+store/user/actions';
import { login, register } from '../../+store/auth/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator, passwordValidator } from '../../shared/interfaces/validators';
import { UserService } from '../user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  form:FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private store: Store<IUserModuleState>
  ){
    const passwordControl = this.fb.control('', [
      Validators.required, passwordValidator
    ]);
    this.form = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      password: passwordControl,

    })
  }

  isLoading$ = this.store.select(state => state.user.login.isLoading);
  errorMessage$ = this.store.select(state => state.user.login.errorMessage);


  ngOnInit(): void{
    this.store.select(state => console.log(state.user.login))
  }

  submitFormHandler(): void{
    const data = this.form.value;
    this.store.dispatch(userLoginSetLoading({ isLoading: true}));
    this.store.dispatch(userLoginSetErrorMessage({message: ''}));

    this.authService.login(data).subscribe(
      {
        next: () => {
          this.store.dispatch(userLoginSetLoading({ isLoading: false }));
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.store.dispatch(userLoginSetLoading({ isLoading: false }));
          this.store.dispatch(userLoginSetErrorMessage({ message: err.error.message }));
        }
      }
    )
  }
}
