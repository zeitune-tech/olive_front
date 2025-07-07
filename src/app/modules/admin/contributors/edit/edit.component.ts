import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContributorService } from '@core/services/administration/contributor/contributor.service';
import { Contributor, ContributorLevel } from '@core/services/administration/contributor/contributor.interface';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';

@Component({
    selector: 'app-contributor-edit',
    templateUrl: './edit.component.html'
})
export class ContributorEditComponent implements OnInit {

    formGroup!: FormGroup;
    message: string = '';
    levels = [
        { value: ContributorLevel.COMPANY, label: 'entities.contributor.options.level.COMPANY' },
        { value: ContributorLevel.POINT_OF_SALE, label: 'entities.contributor.options.level.POINT_OF_SALE' }
    ];
    pointsOfSale: PointOfSale[] = [];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ContributorEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Contributor,
        private contributorService: ContributorService,
        private pointOfSaleService: PointOfSaleService
    ) {
        this.formGroup = this.fb.group({
            firstname: [data.firstname || '', Validators.required],
            lastname: [data.lastname || '', Validators.required],
            email: [data.email || '', [Validators.email]],
            level: [data.level || ContributorLevel.COMPANY, Validators.required],
            pointOfSale: [data.managementEntity || null, this.validatePointOfSale()]
        });
    }

    ngOnInit(): void {
        this.pointOfSaleService.pointsOfSale$.subscribe((points: PointOfSale[]) => {
            this.pointsOfSale = points;
        });

        this.formGroup.get('level')?.valueChanges.subscribe(level => {
            if (level === ContributorLevel.COMPANY) {
                this.formGroup.get('pointOfSale')?.disable();
            } else {
                this.formGroup.get('pointOfSale')?.enable();
            }
        });

        if (this.formGroup.get('level')?.value === ContributorLevel.COMPANY) {
            this.formGroup.get('pointOfSale')?.disable();
        }
    }

    validatePointOfSale(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const level = this.formGroup?.get('level')?.value;
            const pointOfSale = control.value;
            if (level === ContributorLevel.POINT_OF_SALE && !pointOfSale) {
                return { required: true };
            }
            return null;
        };
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updatedContributor = { ...this.data, ...this.formGroup.value };

        this.contributorService.update(updatedContributor).subscribe({
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
