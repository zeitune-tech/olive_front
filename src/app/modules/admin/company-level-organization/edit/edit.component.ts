import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyLevelOrganization } from '@core/services/administration/company-level-organization/company-level-organization.interface';
import { CompanyLevelOrganizationService } from '@core/services/administration/company-level-organization/company-level-organization.service';

@Component({
    selector: 'app-company-level-organization-edit',
    templateUrl: './edit.component.html'
})
export class CompanyLevelOrganizationEditComponent implements OnInit {

    formGroup!: UntypedFormGroup;
    message = '';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CompanyLevelOrganizationEditComponent>,
        private service: CompanyLevelOrganizationService,
        @Inject(MAT_DIALOG_DATA) public data: CompanyLevelOrganization
    ) {}

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            name: [this.data?.name || '', Validators.required],
            description: [this.data?.description || ''],
            // Ajoute d'autres champs si nécessaires
        });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updated: CompanyLevelOrganization = {
            ...this.data,
            ...this.formGroup.value
        };

        this.service.update(updated).subscribe({
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

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
