import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChild } from "@angular/core";
import { UntypedFormControl, FormBuilder, Validators, UntypedFormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/settings/product/product.interface";
import { ProductService } from "@core/services/settings/product/product.service";
import { TaxExemption } from "@core/services/settings/tax-exemption/tax-exemption.interface";
import { TaxExemptionService } from "@core/services/settings/tax-exemption/tax-exemption.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-TaxExemptions-form",
    templateUrl: "./form.component.html",
    animations: animations,
})
export class ExemptionFormComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<TaxExemption> = {
        title: '',
        columns: [
            {
                property: 'name',
                visible: true,
                label: ('entities.TaxExemption.table.columns.name'),
                type: 'text',
            },
            {
                property: 'product',
                visible: true,
                label: ('entities.TaxExemption.table.columns.description'),
                type: 'text',
            },
             
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: TaxExemption, property: keyof TaxExemption) => {

        }
    };

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<TaxExemption> = new MatTableDataSource();
    selection = new SelectionModel<TaxExemption>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _TaxExemptionService: TaxExemptionService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ExemptionFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            TaxExemptions: TaxExemption[];
            product: Product;
            mode: 'add' | 'remove';
        },
        private _productService: ProductService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {
        this.formGroup = this.formBuilder.group({
            TaxExemptions: [[], Validators.required],
        });
    }

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;


    ngOnInit(): void {
        this._TaxExemptionService.taxExemptions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxExemption[]) => {
                this.dataSource.data = data;

                this.selection.clear();

                // If the data is not empty, set the selected TaxExemptions from the data
                if (this.data.TaxExemptions && this.data.TaxExemptions.length > 0) {
                    this.selection.select(...this.data.TaxExemptions);
                }

                this._changeDetectorRef.detectChanges();
            });
    }

    ngAfterViewInit() {
        if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    preview() {
        console.log('preview');
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('checkbox');
        return columns;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
        // add or remove all elements from the selection
        this.formGroup.get('TaxExemptions')?.setValue(this.selection.selected);
    }

    toggleSelection(row: TaxExemption) {
        this.selection.toggle(row);
        // add or remove the element from the selection
        this.formGroup.get('TaxExemptions')?.setValue(this.selection.selected);
    }


    trackByProperty(index: number, column: TableColumn<TaxExemption>) {
        return column.property;
    }

    onSubmit() {

        const TaxExemptions = this.selection.selected.map((coverage: TaxExemption) => coverage.id);

        if (this.data.mode === 'add') {
            // Add TaxExemptions to the product
            this.formGroup.disable();
            const updated = {
                TaxExemptions: TaxExemptions,
            };

            // this._productService.addTaxExemptions(this.data.product.id, updated).subscribe({
            //     next: () => {
            //         this.snackBar.open(
            //             this.translocoService.translate('form.success.update'),
            //             undefined,
            //             { duration: 3000, panelClass: 'snackbar-success' }
            //         );
            //         this.dialogRef.close(true);
            //     },
            //     error: () => {
            //         this.snackBar.open(
            //             this.translocoService.translate('form.errors.submission'),
            //             undefined,
            //             { duration: 3000, panelClass: 'snackbar-error' }
            //         );
            //         this.formGroup.enable();
            //     }
            // });
        } else if (this.data.mode === 'remove') {
            // Remove TaxExemptions from the product
            // this.formGroup.disable();
            // const updated = {
            //     TaxExemptions: TaxExemptions,
            // };

            // this._productService.removeTaxExemptions(this.data.product.id, updated).subscribe({
            //     next: () => {
            //         this.snackBar.open(
            //             this.translocoService.translate('form.success.update'),
            //             undefined,
            //             { duration: 3000, panelClass: 'snackbar-success' }
            //         );
            //         this.dialogRef.close(true);
            //     },
            //     error: () => {
            //         this.snackBar.open(
            //             this.translocoService.translate('form.errors.submission'),
            //             undefined,
            //             { duration: 3000, panelClass: 'snackbar-error' }
            //         );
            //         this.formGroup.enable();
            //     }
            // });
        }
      
    }

    onCancel() {}
}
