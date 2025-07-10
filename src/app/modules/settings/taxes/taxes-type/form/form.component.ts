import { animation } from "@angular/animations";
import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChild } from "@angular/core";
import { UntypedFormControl, FormBuilder, Validators, UntypedFormGroup, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/settings/product/product.interface";
import { ProductService } from "@core/services/settings/product/product.service";
import { TaxNature, TaxType } from "@core/services/settings/tax-type/tax-type.interface";
import { TaxTypeService } from "@core/services/settings/tax-type/tax-type.service";
import { Tax } from "@core/services/settings/tax/tax.interface";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-taxtypes-form",
    templateUrl: "./form.component.html",
    animations: animations
})
export class TypeFormComponent implements OnInit {

    formGroup!: FormGroup;
    message = '';

    taxType: TaxType[] = [];

    typeNature: { label: string, value: string } [] =  [
        { label: 'entities.taxes-type.form.nature.vatPremiums', value: TaxNature.VAT_PREMIUMS },
        { label: 'entities.taxes-type.form.nature.vatAccessories', value: TaxNature.VAT_ACCESSORIES },
        { label: 'entities.taxes-type.form.nature.fga', value: TaxNature.FGA },
        { label: 'entities.taxes-type.form.nature.brownCard', value: TaxNature.BROWN_CARD },
        { label: 'entities.taxes-type.form.nature.other', value: TaxNature.OTHER }           
      ];


    mode: 'create' | 'edit' = 'create';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<TypeFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TaxType,
        private _taxTypeService: TaxTypeService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {

        this.formGroup = this.fb.group({
            name: [this.data.name, Validators.required],
            nature: [this.data.nature, Validators.required],
        });


        this._taxTypeService.taxTypes$.subscribe(taxType => {
            this.taxType = taxType;
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

        this._taxTypeService.update(this.data.id,updated).subscribe({
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
