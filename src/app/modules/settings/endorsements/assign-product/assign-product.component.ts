import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '@core/services/settings/product/product.service';
import { Product } from '@core/services/settings/product/product.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assign-product',
  templateUrl: './assign-product.component.html'
})
export class AssignProductComponent implements OnInit {
  products: Product[] = [];
  selectedProducts: string[] = [];
  form!: FormGroup;
  displayedColumns: string[] = ['checkbox', 'name', 'description', 'fleet'];
  dataSource = new MatTableDataSource<Product>([]);
  selection = new SelectionModel<Product>(true, []);

  constructor(
    private dialogRef: MatDialogRef<AssignProductComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      endorsmentId: string;
      assignedProducts?: Product[];
      onlyFleetProducts?: boolean;   // 👈 flag reçu
      nature?: string;               // optionnel
    },
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const alreadyAssignedIds = new Set(this.data.assignedProducts?.map(p => p.id) ?? []);

    this.productService.getAll().subscribe({
      next: (products: Product[]) => {
        // 👇 filtre flotte si demandé
        const filtered = this.data.onlyFleetProducts
          ? products.filter(p => !!p.fleet)
          : products;

        this.products = filtered;
        this.dataSource.data = filtered;

        // Pré-sélectionner ceux déjà liés (après filtrage)
        const preselected = filtered.filter(p => alreadyAssignedIds.has(p.id));
        this.selection = new SelectionModel<Product>(true, preselected);
      },
      error: err => {
        console.error('Erreur lors du chargement des produits', err);
      }
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  toggleSelection(row: Product): void {
    this.selection.toggle(row);
  }

  onAssign(): void {
    this.dialogRef.close(this.selection.selected);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
