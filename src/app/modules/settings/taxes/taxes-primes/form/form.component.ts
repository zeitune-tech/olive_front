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
import { TaxPrime } from '@core/services/settings/tax-primes/tax-primes.interface';
import { TaxPrimeService } from '@core/services/settings/tax-primes/tax-primes.service';
import { TaxType } from '@core/services/settings/tax-type/tax-type.interface';
import { TaxTypeService } from '@core/services/settings/tax-type/tax-type.service';

@Component({
    selector: 'app-taxes-prime-add',
    templateUrl: './form.component.html'
})
export class PrimesFormComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    taxesType: TaxType[] = [];
    products: Product[] = [];
    coverages: Coverage[] = [];

    mode: 'create' | 'edit' = 'create';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<PrimesFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            mode: 'create' | 'edit',
            data: TaxPrime,
        },
        private _TaxPrimeService: TaxPrimeService,
        private _productService: ProductService,
        private _coverageService: CoverageService,
        private _taxTypeService: TaxTypeService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {

        this.mode = this.data.mode;


        this.formGroup = this.fb.group({
            name: [this.data.data.name, Validators.required],
            dateEffective: [this.data.data.dateEffective, Validators.required],
            calculationBase: ["PRIME"],
            isFlatRate: [this.data.data.isFlatRate, Validators.required],
            flatRateAmount: [this.data.data.flatRateAmount, [Validators.min(0), Validators.max(10000)]],
            rate: [this.data.data.rate, [Validators.required, Validators.min(0), Validators.max(100)]],
            taxTypeId: [this.data.data.taxType.id, Validators.required],
            coverageId: [this.data.data.coverage.id],
            productId: [this.data.data.product.id, Validators.required],
        });

        this._productService.products$.subscribe(products => {
            this.products = products;
        });

        this._coverageService.coverages$.subscribe(coverages => {
            this.coverages = coverages;
        });

        this._taxTypeService.taxTypes$.subscribe(taxesType => {
            this.taxesType = taxesType;
        });
    }

    onSubmit(): void {
        
        if (this.mode === 'create') {
            this.onCreate();
        } else {
            this.onUpdate();
        }
    }

    onCreate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const newTaxPrime: TaxPrime = {
            ...this.formGroup.value
        };

        this._TaxPrimeService.create(newTaxPrime).subscribe({
            next: (response: TaxPrime) => {
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

        const updated = {
            ...this.formGroup.value
        };

        this._TaxPrimeService.update(this.data.data.id, updated).subscribe({
            next: (response: TaxPrime) => {
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

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
