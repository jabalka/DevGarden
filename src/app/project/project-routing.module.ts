import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },  
  {
    path: 'my-projects',
    pathMatch: 'full',
    component: MyProjectsComponent,
  },  
  {
    path: 'new',
    pathMatch: 'full',
    component: NewProjectComponent,
  },
  {
    path: ':id',
    pathMatch: 'full',
    component: ProjectDetailComponent,
  },
  {
    path: 'edit/:id',
    pathMatch: 'full',
    component: ProjectEditComponent,
  },    

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}

