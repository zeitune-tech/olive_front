import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '@core/services/settings/product/product.service';
import { Product } from '@core/services/settings/product/product.interface';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class TaxCommissionFormComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    families = [
        { value: 'RC', label: 'entities.coverage_reference.options.family.RC' },
        { value: 'DOMMAGES', label: 'entities.coverage_reference.options.family.DOMMAGES' },
        { value: 'OTHERS', label: 'entities.coverage_reference.options.family.OTHERS' }
    ];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<TaxCommissionFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Product,
        private _productService: ProductService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            name: [this.data.name, Validators.required],
			description: [this.data.description, Validators.required],
			branch: [this.data.branch.id, Validators.required],
			minRisk: [this.data.minRisk, [Validators.min(1)]],
			maxRisk: [this.data.maxRisk, [Validators.min(1)]],
			minimumGuaranteeNumber: [1, [Validators.required, Validators.min(1)]],
			fleet: [false, Validators.required],
			hasReduction: [false]
        });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updated = {
            ...this.formGroup.value
        };

        this._productService.update(this.data.id,updated).subscribe({
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
