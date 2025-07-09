import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaxExemption } from '@core/services/settings/tax-exemption/tax-exemption.interface';
import { TaxExemptionService } from '@core/services/settings/tax-exemption/tax-exemption.service';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class ExemptionFormComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    families = [
        { value: 'RC', label: 'entities.coverage_reference.options.family.RC' },
        { value: 'DOMMAGES', label: 'entities.coverage_reference.options.family.DOMMAGES' },
        { value: 'OTHERS', label: 'entities.coverage_reference.options.family.OTHERS' }
    ];

    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: TaxExemption,
        private dialogRef: MatDialogRef<ExemptionFormComponent>,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar,
        private _taxExemptionService: TaxExemptionService,
    ) {}

    ngOnInit(): void {

    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updated = {
            ...this.formGroup.value
        };

    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
