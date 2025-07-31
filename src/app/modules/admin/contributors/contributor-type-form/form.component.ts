import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContributorService } from '@core/services/administration/contributor/contributor.service';
import {  ContributorType } from '@core/services/administration/contributor/contributor.interface';

@Component({
    selector: 'app-contributor-edit',
    templateUrl: './form.component.html'
})
export class ContributorTypeFormComponent implements OnInit {

    formGroup!: FormGroup;
    message: string = '';
    mode: 'create' | 'edit';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ContributorTypeFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            mode: 'create' | 'edit',
            contributorType: ContributorType
        },
        private contributorService: ContributorService,
    ) {

        this.mode = data.mode;

        this.formGroup = this.fb.group({
            label: [data.contributorType.label || '', Validators.required],
        });
    }

    ngOnInit(): void {
       
    }

    onCreate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const newContributorType: ContributorType = { ...this.formGroup.value };

        this.contributorService.createContributorType(newContributorType).subscribe({
            next: () => {
                this.message = 'message.success';
                this.dialogRef.close(true);
            },
            error: () => {
                this.message = 'message.error';
                this.formGroup.enable();
            }
        });
    }

    onEdit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updatedContributorType: any = { ...this.data.contributorType, ...this.formGroup.value };

        this.contributorService.updateContributorType(this.data.contributorType.id, updatedContributorType).subscribe({
            next: () => {
                this.message = 'message.success';
                this.dialogRef.close(true);
            },
            error: () => {
                this.message = 'message.error';
                this.formGroup.enable();
            }
        });
    }

    onSubmit(): void {
        if (this.mode === 'create') {
            this.onCreate();
        } else {
            this.onEdit();
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
