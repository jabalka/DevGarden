import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectEditComponent } from './project-edit/project-edit.component';



@NgModule({
  declarations: [
    NewProjectComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  exports: [
    NewProjectComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
  ]
})
export class ProjectModule { }
