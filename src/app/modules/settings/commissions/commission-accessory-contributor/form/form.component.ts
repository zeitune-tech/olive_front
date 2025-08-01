import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '@core/services/settings/product/product.service';
import { Product } from '@core/services/settings/product/product.interface';
import { PointOfSale } from '@core/services/administration/point-of-sale/point-of-sale.interface';
import { PointOfSaleService } from '@core/services/administration/point-of-sale/point-of-sale.service';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { CommissionPrimeFormComponent } from '../../commission-prime/form/form.component';
import { CommissionContributor } from '@core/services/settings/commission-contributor/commission-contributor.interface';
import { CommissionContributorService } from '@core/services/settings/commission-contributor/commission-contributor.service';
import { Contributor, ContributorType } from '@core/services/administration/contributor/contributor.interface';
import { ContributorService } from '@core/services/administration/contributor/contributor.service';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class CommissionAccessoryContributorFormComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    products: Product[] = [];
    coverages: Coverage[] = [];
    typesPointOfSale: { label: string, value: string }[] = [
        { label: 'Courtier', value: 'BROKER' },
        { label: 'Agent Général', value: 'GENERAL_AGENT' },
        { label: 'Bureau Direct', value: 'DIRECT_OFFICE' }
    ];
    contributors: Contributor[] = [];
    contributorTypes: ContributorType[] = []

    mode: 'create' | 'edit' = 'create';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CommissionPrimeFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            mode: 'create' | 'edit',
            commissionContributor: CommissionContributor
        },
        private _commissionContributorService: CommissionContributorService,
        private _contributorService: ContributorService,
        private _productService: ProductService,
        private _coverageService: CoverageService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {

        this.mode = this.data.mode;

        this.formGroup = this.fb.group({
            dateEffective: [this.data?.commissionContributor.dateEffective || new Date(), Validators.required],
            calculationBase: ["ACCESSORY"],
            managementRate: [this.data?.commissionContributor.managementRate || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
            contributionRate: [this.data?.commissionContributor.contributionRate || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
            contributorTypeId: [this.data?.commissionContributor.contributorType.id],
            contributorId: [this.data?.commissionContributor.contributorId],
            productId: [this.data?.commissionContributor.product.id, Validators.required],
        })

        this._productService.products$.subscribe(products => {
            this.products = products;
        });

        this._coverageService.coverages$.subscribe(coverages => {
            this.coverages = coverages;
        });

    }

    onCreate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const newCommission: any = {
            ...this.formGroup.value,
        };

        this._commissionContributorService.create(newCommission).subscribe({
            next: (response: CommissionContributor) => {
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

        const updated: any = {
            ...this.formGroup.value,
        };

        this._commissionContributorService.update(this.data.commissionContributor.id, updated).subscribe({
            next: (response: CommissionContributor) => {
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

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

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
