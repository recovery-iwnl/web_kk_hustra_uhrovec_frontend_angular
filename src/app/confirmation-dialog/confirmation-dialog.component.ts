import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Upozornenie</h2>
    <div mat-dialog-content>Ste si istý, že si chcete vymazať účet?</div>
    <div mat-dialog-actions>
      <button type="button" class="btn btn-secondary" (click)="onYesClick()" style="margin-left: 20px;">Áno</button>
      <button type="button" class="btn btn-secondary" (click)="onNoClick()" style="margin-left: 170px;">Nie</button>
    </div>
  `,
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
