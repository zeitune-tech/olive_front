import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '@core/services/settings/product/product.service';
import { Product } from '@core/services/settings/product/product.interface';
import { CommissionPointOfSale } from '@core/services/settings/commission-point-of-sale/commission-point-of-sale.interface';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { CommissionPointOfSaleService } from '@core/services/settings/commission-point-of-sale/commission-point-of-sale.service';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { CommissionPrimeFormComponent } from '../../commission-prime/form/form.component';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class CommissionAccessoryContributorFormComponent implements OnInit {

      formGroup!: FormGroup;
      message = '';
  
      products: Product[] = [];
      coverages: Coverage[] = [];
      typesPointOfSale: { label: string, value: string } [] = [
          { label: 'Courtier', value: 'BROKER' },
          { label: 'Agent Général', value: 'GENERAL_AGENT' },
          { label: 'Bureau Direct', value: 'DIRECT_OFFICE' }
      ];
      pointsOfSale: PointOfSale[] = [];
  
      mode: 'create' | 'edit' = 'create';
  
      constructor(
          private fb: FormBuilder,
          private dialogRef: MatDialogRef<CommissionPrimeFormComponent>,
          @Inject(MAT_DIALOG_DATA) public data: CommissionPointOfSale,
          private _commissionPointOfSaleService: CommissionPointOfSaleService,
          private _productService: ProductService,
          private _coverageService: CoverageService,
          private _pointOfSaleService: PointOfSaleService,
          private translocoService: TranslocoService,
          private snackBar: MatSnackBar
      ) {}
  
      ngOnInit(): void {
  
          if (this.data) {
              this.mode = 'edit';
              this.dialogRef.updateSize('600px', 'auto');
          } else {
              this.data = {} as CommissionPointOfSale;
              this.mode = 'create';
              this.dialogRef.updateSize('600px', 'auto');
          }
  
  
          this.formGroup = this.fb.group({
              dateEffective: [this.data.dateEffective, Validators.required],
              calculationBase: ["PRIME", Validators.required],
              managementRate: [this.data.managementRate, [Validators.required, Validators.min(0), Validators.max(100)]],
              contributionRate: [this.data.contributionRate, [Validators.required, Validators.min(0), Validators.max(100)]],
              typePointOfSale: [this.data.typePointOfSale, Validators.required],
              pointOfSale: [this.data.pointOfSale, Validators.required],
              product: [this.data.product, Validators.required],
              coverage: [this.data.coverage, Validators.required],
          });
  
          this._productService.products$.subscribe(products => {
              this.products = products;
          });
  
          this._coverageService.coverages$.subscribe(coverages => {
              this.coverages = coverages;
          });
  
          this._pointOfSaleService.pointsOfSale$.subscribe(pointsOfSale => {
              this.pointsOfSale = pointsOfSale;
          });
      }
  
      onSubmit(): void {
          if (this.formGroup.invalid) return;
  
          this.formGroup.disable();
  
          const updated = {
              ...this.formGroup.value
          };
  
          this._commissionPointOfSaleService.update(this.data.id,updated).subscribe({
              next: () => {
                  this.snackBar.open(
                      this.translocoService.translate('form.success.update'),
                      undefined,
                      { duration: 3000, panelClass: 'snackbar-success' }
                  );
                  this.dialogRef.close(true);
              },
              error: () => {
                  this.snackBar.open(
                      this.translocoService.translate('form.errors.submission'),
                      undefined,
                      { duration: 3000, panelClass: 'snackbar-error' }
                  );
                  this.formGroup.enable();
              }
          });
      }
  
      onCancel(): void {
          this.dialogRef.close(false);
      }
  }
  