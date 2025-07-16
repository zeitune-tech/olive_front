import { animation } from "@angular/animations";
import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/settings/product/product.interface";
import { ProductService } from "@core/services/settings/product/product.service";
import { TaxExemption } from "@core/services/settings/tax-exemption/tax-exemption.interface";
import { TaxExemptionService } from "@core/services/settings/tax-exemption/tax-exemption.service";
import { TaxNature } from "@core/services/settings/tax-type/tax-type.interface";
import { Tax } from "@core/services/settings/tax/tax.interface";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-taxExemptions-form",
    templateUrl: "./form.component.html",
    animations: animations
})
export class ExemptionFormComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    taxExemption: TaxExemption[] = [];

    mode: 'create' | 'edit' = 'create';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ExemptionFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TaxExemption,
        private _taxExemptionService: TaxExemptionService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {

        this.formGroup = this.fb.group({
            name: [this.data.name, Validators.required],
        });


        this._taxExemptionService.taxExemptions$.subscribe(taxExemption => {
            this.taxExemption = taxExemption;
        });

        // this._pointOfSaleService.pointsOfSale$.subscribe(pointsOfSale => {
        //     this.pointsOfSale = pointsOfSale;
        // });
    }

    onSubmit(): void {
        if (this.formGroup.invalid) return;

        this.formGroup.disable();

        const updated = {
            ...this.formGroup.value
        };

        this._taxExemptionService.update(this.data.id,updated).subscribe({
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
