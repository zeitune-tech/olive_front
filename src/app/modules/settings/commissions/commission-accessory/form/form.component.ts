import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '@core/services/settings/product/product.service';
import { Product } from '@core/services/settings/product/product.interface';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { CommissionPointOfSale } from '@core/services/settings/commission-point-of-sale/commission-point-of-sale.interface';
import { CommissionPointOfSaleService } from '@core/services/settings/commission-point-of-sale/commission-point-of-sale.service';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { CommissionPrimeFormComponent } from '../../commission-prime/form/form.component';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class CommissionAccessoryFormComponent implements OnInit {


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
        private dialogRef: MatDialogRef<CommissionAccessoryFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            mode: 'create' | 'edit',
            commissionPointOfSale: CommissionPointOfSale
        },
        private _commissionPointOfSaleService: CommissionPointOfSaleService,
        private _productService: ProductService,
        private _coverageService: CoverageService,
        private _pointOfSaleService: PointOfSaleService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {

        this.mode = this.data.mode;

        this.formGroup = this.fb.group({
            dateEffective: [this.data?.commissionPointOfSale.dateEffective, Validators.required],
            calculationBase: ["ACCESSORY"],
            managementRate: [this.data?.commissionPointOfSale.managementRate, [Validators.required, Validators.min(0), Validators.max(100)]],
            contributionRate: [this.data?.commissionPointOfSale.contributionRate, [Validators.required, Validators.min(0), Validators.max(100)]],
            pointOfSaleType: [this.data?.commissionPointOfSale.typePointOfSale],
            pointOfSaleId: [this.data?.commissionPointOfSale.pointOfSale?.id || null],
            productId: [this.data?.commissionPointOfSale.product?.id || null, Validators.required],
        });

        this._productService.products$.subscribe(products => {
            this.products = products;
        });

        this._pointOfSaleService.pointsOfSale$.subscribe(pointsOfSale => {
            this.pointsOfSale = pointsOfSale;
        });
    }

    onCreate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const newCommission: CommissionPointOfSale = {
            ...this.formGroup.value,
            product: this.data.commissionPointOfSale.product,
            coverage: this.data.commissionPointOfSale.coverage
        };

        this._commissionPointOfSaleService.create(newCommission).subscribe({
            next: (response: CommissionPointOfSale) => {
                this.snackBar.open(
                    this.translocoService.translate('form.success.create'),
                    undefined,
                    { duration: 3000, panelClass: 'snackbar-success' }
                );
                this.dialogRef.close(response);
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

        const updatedCommission: CommissionPointOfSale = {
            ...this.formGroup.value,
            id: this.data.commissionPointOfSale.id,
            product: this.data.commissionPointOfSale.product,
            coverage: this.data.commissionPointOfSale.coverage
        };

        this._commissionPointOfSaleService.update(updatedCommission.id, updatedCommission).subscribe({
            next: (response: CommissionPointOfSale) => {
                this.snackBar.open(
                    this.translocoService.translate('form.success.update'),
                    undefined,
                    { duration: 3000, panelClass: 'snackbar-success' }
                );
                this.dialogRef.close(response);
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
        } else if (this.mode === 'edit') {
            this.onUpdate();
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
