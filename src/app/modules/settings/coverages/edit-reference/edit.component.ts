import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoverageReferenceService } from '@core/services/settings/coverage-reference/coverage-reference.service';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './edit.component.html'
})
export class CoverageReferenceEditComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    families = [
        { value: 'RC', label: 'entities.coverage_reference.options.family.RC' },
        { value: 'DOMMAGES', label: 'entities.coverage_reference.options.family.DOMMAGES' },
        { value: 'OTHERS', label: 'entities.coverage_reference.options.family.OTHERS' }
    ];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CoverageReferenceEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private coverageReferenceService: CoverageReferenceService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            designation: [this.data.designation || '', Validators.required],
            family: [this.data.family || '', Validators.required],
            accessCharacteristic: [this.data.accessCharacteristic, Validators.required],
            tariffAccess: [this.data.tariffAccess, Validators.required],
            toShareOut: [this.data.toShareOut]
        });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updated = {
            ...this.data,
            ...this.formGroup.value
        };

        this.coverageReferenceService.update(updated).subscribe({
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
