import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IUserModuleState } from '../../+store/user';
import { emailValidator, passwordValidator, rePasswordValidatorFactory } from '../../shared/interfaces/validators';
import { userRegisterSetErrorMessage, userRegisterSetLoading } from '../../+store/user/actions';
import { register } from '../../+store/auth/actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;
  isPasswordVisible: boolean = false;
  isRePasswordVisible: boolean = false;
  isLoading$ = this.store.select(state => state.user.register.isLoading);
  errorMessage$ = this.store.select(state => state.user.register.errorMessage);
  errorMessage = ''

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<IUserModuleState>
  ){
    const passwordControl = this.fb.control('', [
      Validators.required,
      passwordValidator,
    ]);
    this.form = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      password:  passwordControl,
      rePassword: ['', [Validators.required, rePasswordValidatorFactory(passwordControl)]],
    });
  }

  submitHandler(): void {
    const data = this.form.value;
    this.store.dispatch(userRegisterSetLoading({ isLoading: true}));
    this.store.dispatch(userRegisterSetErrorMessage({ message: ''}));

    this.authService.register(data).subscribe({
      next: () => {
        this.store.dispatch(userRegisterSetLoading({ isLoading: false}));
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.store.dispatch(userRegisterSetLoading({ isLoading: false}));
        this.store.dispatch(userRegisterSetErrorMessage({ message: err.error.message}));
        this.errorMessage = err.error.message; // show error message on form
      }
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible =!this.isPasswordVisible;
  }

  toggleRePasswordVisibility(): void {
    this.isRePasswordVisible =!this.isRePasswordVisible;
  }

}
