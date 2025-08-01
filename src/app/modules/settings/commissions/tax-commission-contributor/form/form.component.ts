import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '@core/services/settings/product/product.service';
import { Product } from '@core/services/settings/product/product.interface';
import { Coverage } from '@core/services/settings/coverage/coverage.interface';
import { CoverageService } from '@core/services/settings/coverage/coverage.service';
import { CommissionPrimeFormComponent } from '../../commission-prime/form/form.component';
import { Contributor } from '@core/services/administration/contributor/contributor.interface';
import { ContributorService } from '@core/services/administration/contributor/contributor.service';
import { TaxCommissionsContributor } from '@core/services/settings/commission-tax-contributor/commission-tax-contributor.interface';
import { TaxCommissionsContributorService } from '@core/services/settings/commission-tax-contributor/commission-tax-contributor.service';

@Component({
    selector: 'app-coverage-reference-edit',
    templateUrl: './form.component.html'
})
export class TaxCommissionContributorFormComponent implements OnInit {



    formGroup!: FormGroup;
    message = '';

    products: Product[] = [];
    coverages: Coverage[] = [];
    contributorTypes: { label: string, value: string }[] = [
        { label: 'Courtier', value: 'BROKER' },
        { label: 'Agent Général', value: 'GENERAL_AGENT' },
        { label: 'Bureau Direct', value: 'DIRECT_OFFICE' }
    ];
    contributors: Contributor[] = [];

    mode: 'create' | 'edit' = 'create';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CommissionPrimeFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            mode: 'create' | 'edit',
            item: TaxCommissionsContributor
        },
        private _taxCommissionContributor: TaxCommissionsContributorService,
        private _productService: ProductService,
        private _coverageService: CoverageService,
        private _pointOfSaleService: ContributorService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {

        this.mode = this.data.mode;

        this.formGroup = this.fb.group({
            dateEffective: [this.data.item.dateEffective, Validators.required],
            rate: [this.data.item.rate, [Validators.required, Validators.min(0), Validators.max(100)]],
            typeContributorId: [this.data.item.contributorType.id],
            contributorId: [this.data.item.contributor.id],
            toWithhold: [this.data.item.toWithhold || false, Validators.required],
            productId: [this.data.item.product.id, Validators.required],
        });

        this._productService.products$.subscribe(products => {
            this.products = products;
        });

        this._coverageService.coverages$.subscribe(coverages => {
            this.coverages = coverages;
        });

        this._pointOfSaleService.contributors$.subscribe(contributors => {
            this.contributors = contributors;
        });
    }

    onCreate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const newCommission: TaxCommissionsContributor = {
            ...this.formGroup.value,
            id: null // Ensure ID is null for creation
        };

        this._taxCommissionContributor.create(newCommission).subscribe({
            next: () => {
                this.snackBar.open(
                    this.translocoService.translate('form.success.create'),
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

    onUpdate(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updatedCommission: TaxCommissionsContributor = {
            ...this.data.item,
            ...this.formGroup.value
        };

        this._taxCommissionContributor.update(updatedCommission.id, updatedCommission).subscribe({
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