import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-company-level-organization-add-points-dialog',
  templateUrl: './add-points-dialog.component.html',
})
export class CompanyLevelOrganizationAddPointsDialogComponent implements OnInit {
  allPoints: PointOfSale[] = [];
  filteredPoints: PointOfSale[] = [];
  selection = new SelectionModel<PointOfSale>(true, []);
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CompanyLevelOrganizationAddPointsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { excludedPointsOfSale: string[] },
    private pointOfSaleService: PointOfSaleService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.pointOfSaleService.pointsOfSale$.subscribe((points: PointOfSale[]) => {
      this.allPoints = points;
      this.filteredPoints = this.allPoints.filter(p => !this.data.excludedPointsOfSale.includes(p.id));
      this.loading = false;
    });
  }

  confirmSelection(): void {
    this.dialogRef.close(this.selection.selected);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  toggleSelection(row: PointOfSale): void {
    this.selection.toggle(row);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.filteredPoints.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.filteredPoints.forEach(row => this.selection.select(row));
  }
}
