import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { Router, RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NewProjectComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
    MyProjectsComponent,

  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  exports: [
    NewProjectComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
    MyProjectsComponent
  ]
})
export class ProjectModule { }
