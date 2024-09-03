import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { RouterModule } from '@angular/router';
import { ProjectRoutingModule } from './project-routing.module';

const COMPONENTS = [NewProjectComponent,
  ProjectDetailComponent,
  ProjectEditComponent,
  MyProjectsComponent,];

const MODULES = [ReactiveFormsModule,
  FormsModule,
  CommonModule,
  RouterModule,
  ProjectRoutingModule]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES],
  exports: [...COMPONENTS]
})
export class ProjectModule { }
