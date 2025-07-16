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
        @Inject(MAT_DIALOG_DATA) public data: TaxAccessory,
        private _taxAccessoryService: TaxAccessoryService,
        private _productService: ProductService,
        private _taxTypeService: TaxTypeService,
        // private _pointOfSaleService: PointOfSaleService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {

        if (this.data) {
            this.mode = 'edit';
            this.dialogRef.updateSize('600px', 'auto');
        } else {
            this.data = {} as TaxAccessory;
            this.mode = 'create';
            this.dialogRef.updateSize('600px', 'auto');
        }


        this.formGroup = this.fb.group({
            name: [this.data.name, Validators.required],
            dateEffective: [this.data.dateEffective, Validators.required],
            calculationBase: ["PRIME", Validators.required],
            isFlatRate: [this.data.isFlatRate, Validators.required],
            flatRateAmount: [this.data.flatRateAmount, [Validators.min(0), Validators.max(10000)]],
            rate: [this.data.rate, [Validators.required, Validators.min(0), Validators.max(100)]],
            taxType: [this.data.taxType, Validators.required],
            product: [this.data.product, Validators.required],
        });

        this._productService.products$.subscribe(products => {
            this.products = products;
        });

        this._taxTypeService.taxTypes$.subscribe(taxesType => {
            this.taxesType = taxesType;
        });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updated = {
            ...this.formGroup.value
        };

        this._taxAccessoryService.update(this.data.id,updated).subscribe({
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
