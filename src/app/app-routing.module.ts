import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewProjectComponent } from './project/new-project/new-project.component';
import { ProjectEditComponent } from './project/project-edit/project-edit.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'projects', component: DashboardComponent },
  { path: 'projects/new', pathMatch: 'full', component: NewProjectComponent },
  { path: 'projects/:id', pathMatch: 'full', component: ProjectDetailComponent},
  { path: 'projects/edit/:id', pathMatch: 'full', component: ProjectEditComponent},
  { path: 'profile', canActivate: [authGuard], component: ProfileComponent},
  { path: 'projects/**', pathMatch: 'full', component: NotFoundComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

