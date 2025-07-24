import { Component, Inject, OnInit, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '@core/services/settings/product/product.interface';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { ProductService } from '@core/services/settings/product/product.service';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { TaxType } from '@core/services/settings/tax-type/tax-type.interface';
import { TaxTypeService } from '@core/services/settings/tax-type/tax-type.service';
import { TaxAccessory } from '@core/services/settings/tax-accessory/tax-accessory.interface';
import { TaxAccessoryService } from '@core/services/settings/tax-accessory/tax-accessory.service';

@Component({
    selector: 'app-taxes-accessories-add',
    templateUrl: './form.component.html'
})
export class AccessoriesFormComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    taxesType: TaxType[] = [];
    products: Product[] = [];

    mode: 'create' | 'edit' = 'create';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AccessoriesFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            mode: 'create' | 'edit',
            data: TaxAccessory,
            product: Product,
        },
        private _taxAccessoryService: TaxAccessoryService,
        private _productService: ProductService,
        private _taxTypeService: TaxTypeService,
        // private _pointOfSaleService: PointOfSaleService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {

    
        this.mode = this.data.mode;
        this.formGroup = this.fb.group({
            name: [this.data.data?.name, Validators.required],
            dateEffective: [this.data.data?.dateEffective, Validators.required],
            calculationBase: ['ACCESSORY', Validators.required],
            isFlatRate: [this.data.data?.isFlatRate, Validators.required],
            flatRateAmount: [this.data.data?.flatRateAmount, [Validators.min(0), Validators.max(10000)]],
            rate: [this.data.data?.rate, [Validators.required, Validators.min(0), Validators.max(100)]],
            taxTypeId: [this.data.data?.taxType.id, Validators.required],
            productId: [this.data.product.id, Validators.required],
        });

        this._productService.products$.subscribe(products => {
            this.products = products;
        });

        this._taxTypeService.taxTypes$.subscribe(taxesType => {
            this.taxesType = taxesType.filter(taxType => taxType.nature === 'VAT_ACCESSORIES' || taxType.nature === 'OTHER');
        });
    }

    onCreate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const newTaxAccessory: TaxAccessory = {
            ...this.formGroup.value,
            product: this.data.product,
        };

        this._taxAccessoryService.create(newTaxAccessory).subscribe({
            next: (response: TaxAccessory) => {
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

    onUpate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updated: TaxAccessory = {
            ...this.formGroup.value,
            id: this.data.data.id,
            product: this.data.product,
        };

        this._taxAccessoryService.update(updated.id, updated).subscribe({
            next: (response: TaxAccessory) => {
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
        } else {
            this.onUpate();
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
