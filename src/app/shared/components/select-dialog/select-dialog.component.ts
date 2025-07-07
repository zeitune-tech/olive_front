import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SelectDialogData {
  title: string;
  items: any[];
  displayField: string;
}

@Component({
  selector: 'app-select-dialog',
  templateUrl: './select-dialog.component.html',
})
export class SelectDialogComponent {
  filteredItems: any[] = [];
  search = '';

  constructor(
    public dialogRef: MatDialogRef<SelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectDialogData
  ) {
    this.filteredItems = data.items;
  }

  filter(): void {
    const term = this.search.toLowerCase();
    this.filteredItems = this.data.items.filter((item) =>
      item[this.data.displayField].toLowerCase().includes(term)
    );
  }

  select(item: any): void {
    this.dialogRef.close(item);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
