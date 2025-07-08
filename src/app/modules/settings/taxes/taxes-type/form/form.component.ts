import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class TypeFormComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    families = [
        { value: 'RC', label: 'entities.coverage_reference.options.family.RC' },
        { value: 'DOMMAGES', label: 'entities.coverage_reference.options.family.DOMMAGES' },
        { value: 'OTHERS', label: 'entities.coverage_reference.options.family.OTHERS' }
    ];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<TypeFormComponent>,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
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
