import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '@core/services/settings/product/product.service';
import { Product } from '@core/services/settings/product/product.interface';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { CommissionPrimeFormComponent } from '../../commission-prime/form/form.component';
import { TaxCommissionsPointOfSale } from '@core/services/settings/commission-tax-point-ofsale/commission-tax-point-of-sale.interface';
import { TaxCommissionsPointOfSaleService } from '@core/services/settings/commission-tax-point-ofsale/commission-tax-point-of-sale.service';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class TaxCommissionFormComponent implements OnInit {


    formGroup!: FormGroup;
    message = '';

    products: Product[] = [];
    coverages: Coverage[] = [];
    typesPointOfSale: { label: string, value: string }[] = [
        { label: 'Courtier', value: 'BROKER' },
        { label: 'Agent Général', value: 'GENERAL_AGENT' },
        { label: 'Bureau Direct', value: 'DIRECT_OFFICE' }
    ];
    pointsOfSale: PointOfSale[] = [];

    mode: 'create' | 'edit' = 'create';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CommissionPrimeFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            mode: 'create' | 'edit';
            commissionTaxPointOfSale: TaxCommissionsPointOfSale;
        },
        private _taxCommissionsPointOfSaleService: TaxCommissionsPointOfSaleService,
        private _productService: ProductService,
        private _coverageService: CoverageService,
        private _pointOfSaleService: PointOfSaleService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {

        this.mode = this.data.mode;

        this.formGroup = this.fb.group({
            dateEffective: [this.data.commissionTaxPointOfSale.dateEffective, Validators.required],
            rate: [this.data.commissionTaxPointOfSale.rate || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
            pointOfSaleType: [this.data.commissionTaxPointOfSale.pointOfSaleType],
            pointOfSaleId: [this.data.commissionTaxPointOfSale.pointOfSale.id],
            toWithhold: [this.data.commissionTaxPointOfSale.toWithhold || false],
            productId: [this.data.commissionTaxPointOfSale.product.id, Validators.required],
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

    onCreate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const newCommission: any = {
            ...this.formGroup.value,
        };

        this._taxCommissionsPointOfSaleService.create(newCommission).subscribe({
            next: (result) => {
                this.snackBar.open(
                    this.translocoService.translate('form.success.create'),
                    undefined,
                    { duration: 3000, panelClass: 'snackbar-success' }
                );
                this.dialogRef.close(result);
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

    onUpdate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updatedCommission: any = {
            ...this.formGroup.value,
            id: this.data.commissionTaxPointOfSale.id
        };

        this._taxCommissionsPointOfSaleService.update(this.data.commissionTaxPointOfSale.id, updatedCommission).subscribe({
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

    onSubmit(): void {
        if (this.mode === 'create') {
            this.onCreate();
        } else {
            this.onUpdate();
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}