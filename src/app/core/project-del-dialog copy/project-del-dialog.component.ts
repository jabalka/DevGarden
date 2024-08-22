import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog'

@Component({
  selector: 'app-project-del-dialog',
  templateUrl: './project-del-dialog.component.html',
  styleUrl: './project-del-dialog.component.css'
})
export class ProjectDelDialogComponent {
  constructor(public dialogRef: MatDialogRef<ProjectDelDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
