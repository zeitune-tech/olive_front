import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDeleteData {
  title?: string;
  message: string;
  itemName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isErrorOnly?: boolean;
}

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html'
})
export class ConfirmDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
