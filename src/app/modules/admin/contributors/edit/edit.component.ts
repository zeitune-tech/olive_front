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
export class ContributorFormComponent implements OnInit {

    formGroup!: FormGroup;
    message: string = '';
    levels = [
        { value: ContributorLevel.COMPANY, label: 'entities.contributor.options.level.COMPANY' },
        { value: ContributorLevel.POINT_OF_SALE, label: 'entities.contributor.options.level.POINT_OF_SALE' }
    ];
    pointsOfSale: PointOfSale[] = [];
    contributorTypes: { id: string, label: string }[] = [];
    mode: 'create' | 'edit' = 'create';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ContributorFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            mode: 'create' | 'edit';
            contributor: Contributor;
        },
        private contributorService: ContributorService,
        private pointOfSaleService: PointOfSaleService
    ) {

        this.mode = data.mode;

        this.formGroup = this.fb.group({
            id: [data.contributor?.id || ''],
            firstname: [data.contributor?.firstname || '', Validators.required],
            lastname: [data.contributor?.lastname || '', Validators.required],
            email: [data.contributor?.email || '', [Validators.email]],
            phone: [data.contributor?.phone || ''],
            level: [data.contributor?.level || ContributorLevel.COMPANY, Validators.required],
            pointOfSale: [data.contributor?.managementEntity || '', this.validatePointOfSale()],
            contributorTypeId: [data.contributor?.contributorType?.id || '', Validators.required]
        });

        this.contributorService.contributorTypes$.subscribe((types) => {
            this.contributorTypes = types;
        });

        this.pointOfSaleService.pointsOfSale$.subscribe((points) => {
            this.pointsOfSale = points;
        });
    }

    ngOnInit(): void {

        // this.formGroup.get('level')?.valueChanges.subscribe(level => {
        //     if (level === ContributorLevel.COMPANY) {
        //         this.formGroup.get('pointOfSale')?.disable();
        //     } else {
        //         this.formGroup.get('pointOfSale')?.enable();
        //     }
        // });

        // if (this.formGroup.get('level')?.value === ContributorLevel.COMPANY) {
        //     this.formGroup.get('pointOfSale')?.disable();
        // }
    }

    onCreate(): void {
        if (this.formGroup.invalid) return;
        this.formGroup.disable();

        const newContributor: any = {
            ...this.formGroup.value,
        };

        console.log('Creating contributor:', newContributor);

        this.contributorService.create(newContributor).subscribe({
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

    onUpdate(): void {
        if (this.formGroup.invalid) return;
        this.formGroup.disable();

        const updatedContributor: any = {
            ...this.formGroup.value,
        };

        this.contributorService.update(updatedContributor.id, updatedContributor).subscribe({
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
        if (this.mode === 'create') {
            this.onCreate();
        } else {
            this.onUpdate();
        }
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
