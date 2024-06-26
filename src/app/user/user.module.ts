import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { UserEffects } from '../+store/auth/effects';
import { EffectsModule } from '@ngrx/effects';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    EffectsModule.forRoot([UserEffects]),
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
