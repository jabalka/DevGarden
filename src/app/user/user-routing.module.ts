import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard new';
import { ProfileComponent } from './profile/profile.component';
import { isGuest } from '../core/guards/isGuest.guard';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [

  {
    path: 'login',
    pathMatch: 'full',
    canActivate: [isGuest],
    component: LoginComponent,
  }, 
  {
    path: 'register',
    pathMatch: 'full',
    canActivate: [isGuest],
    component: RegisterComponent,
  },  
  {
    path: 'profile',
    pathMatch: 'full',
    canActivate: [authGuard],
    component: ProfileComponent,
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}

