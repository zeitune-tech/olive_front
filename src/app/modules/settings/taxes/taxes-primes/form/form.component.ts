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
import { TaxPrime } from "@core/services/settings/tax-primes/tax-primes.interface";
import { TaxPrimeService } from "@core/services/settings/tax-primes/tax-primes.service";
import { TranslocoService } from "@jsverse/transloco";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-taxPrime-form",
    templateUrl: "./form.component.html",
})
export class PrimesFormComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<TaxPrime> = {
        title: '',
        // id: string;
        //   name: string;
        //   dateEffective: string; 
        //   calculationBase: string;
        //   isFlatRate: boolean;
        //   flatRateAmount: number | null;
        //   rate: number | null;
        //   taxType: TaxType;
        //   coverage: Coverage;
        //   product: Product;
        columns: [
            {
                property: 'name',
                visible: true,
                label: ('entities.TaxPrime.table.columns.name'),
                type: 'text',
            },
            {
                property: 'dateEffective',
                visible: true,
                label: ('entities.TaxPrime.table.columns.dateEffective'),
                type: 'text',
            },
            {
                property: 'calculationBase',
                visible: true,
                label: ('entities.TaxPrime.table.columns.calculationBase'),
                type: 'text',
            },
            {
                property: 'isFlatRate',
                visible: true,
                label: ('entities.TaxPrime.table.columns.isFlatRate'),
                type: 'text',
            },
            {
                property: 'flatRateAmount',
                visible: true,
                label: ('entities.TaxPrime.table.columns.flatRateAmount'),
                type: 'text',
            },
            {
                property: 'rate',
                visible: true,
                label: ('entities.TaxPrime.table.columns.rate'),
                type: 'text',
            },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: TaxPrime, property: keyof TaxPrime) => {
            if (property === 'isFlatRate') {
                return element.isFlatRate ? this.translocoService.translate('entities.TaxPrime.isFlatRate.yes') : this.translocoService.translate('entities.TaxPrime.isFlatRate.no');
            }
            if (property === 'dateEffective') {
                return new Date(element.dateEffective).toLocaleDateString();
            }
            if (property === 'taxType') {
                return this.translocoService.translate(`entities.TaxType.nature.${element.taxType.nature}`);
            }
            if (property === 'coverage') {
                return this.translocoService.translate(`entities.Coverage.nature.${element.coverage.nature}`);
            }
            if (property === 'product') {
                return element.product.name;
            }
            
            return element[property];
        }
    };

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<TaxPrime> = new MatTableDataSource();
    selection = new SelectionModel<TaxPrime>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _taxPrimeService: TaxPrimeService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<PrimesFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            taxPrime: TaxPrime[];
            product: Product;
            mode: 'add' | 'remove';
        },
        private _productService: ProductService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {
        this.formGroup = this.formBuilder.group({
            taxPrime: [[], Validators.required],
        });
    }

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;


    ngOnInit(): void {
        this._taxPrimeService.taxPrime$
            // .pipe(takeUntil(this._unsubscribeAll))
            // .subscribe((data: TaxPrime[]) => {
            //     this.dataSource.data = data;

            //     this.selection.clear();

            //     // If the data is not empty, set the selected taxPrime from the data
            //     if (this.data.taxPrime && this.data.taxPrime.length > 0) {
            //         this.selection.select(...this.data.taxPrime);
            //     }

            //     this._changeDetectorRef.detectChanges();
            // });
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
        this.formGroup.get('taxPrime')?.setValue(this.selection.selected);
    }

    toggleSelection(row: TaxPrime) {
        this.selection.toggle(row);
        // add or remove the element from the selection
        this.formGroup.get('taxPrime')?.setValue(this.selection.selected);
    }


    trackByProperty(index: number, column: TableColumn<TaxPrime>) {
        return column.property;
    }

    onSubmit() {

        const taxPrime = this.selection.selected.map((coverage: TaxPrime) => coverage.id);

        if (this.data.mode === 'add') {
            // Add taxPrime to the product
            this.formGroup.disable();
            const updated = {
                taxPrime: taxPrime,
            };

            // this._productService.addtaxPrime(this.data.product.id, updated).subscribe({
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
            // Remove taxPrime from the product
            // this.formGroup.disable();
            // const updated = {
            //     taxPrime: taxPrime,
            // };

            // this._productService.removetaxPrime(this.data.product.id, updated).subscribe({
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
