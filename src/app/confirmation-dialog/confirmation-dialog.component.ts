import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title class="dialog-title">{{ dialogTitle }}</h2>
    <div mat-dialog-content class="dialog-content">{{ dialogContent }}</div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-stroked-button color="primary" (click)="onYesClick()" class="rounded-button">Áno</button>
      <button mat-stroked-button color="basic" (click)="onNoClick()" class="rounded-button">Nie</button>
    </div>
  `,
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  dialogTitle: string;
  dialogContent: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: string }
  ) {
    this.dialogTitle = data.title;
    this.dialogContent = data.content;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
