import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog'

@Component({
  selector: 'app-confirm-del-dialog',
  templateUrl: './confirm-del-dialog.component.html',
  styleUrl: './confirm-del-dialog.component.css'
})
export class ConfirmDelDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDelDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
