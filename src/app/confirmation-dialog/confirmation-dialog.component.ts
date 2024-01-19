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
  /**
   * Title of the confirmation dialog.
   */
  dialogTitle: string;
  /**
   * Content of the confirmation dialog.
   */
  dialogContent: string;

  /**
   * Creates an instance of ConfirmationDialogComponent.
   *
   * @param dialogRef - Reference to the MatDialogRef for the dialog.
   * @param data - Data containing the title and content for the dialog.
   */
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: string }
  ) {
    this.dialogTitle = data.title;
    this.dialogContent = data.content;
  }

  /**
   * Handles the click event when the 'No' button is clicked.
   * Closes the dialog with a result of `false`.
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Handles the click event when the 'Yes' button is clicked.
   * Closes the dialog with a result of `true`.
   */
  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
