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
import { TaxType } from "@core/services/settings/tax-type/tax-type.interface";
import { TaxTypeService } from "@core/services/settings/tax-type/tax-type.service";
import { TranslocoService } from "@jsverse/transloco";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-taxtypes-form",
    templateUrl: "./form.component.html",
})
export class TypeFormComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<TaxType> = {
        title: '',
        //   id: string;
        //   name: string;
        //   nature: TaxNature;
        columns: [
            {
                property: 'name',
                visible: true,
                label: ('entities.TaxType.table.columns.name'),
                type: 'text',
            },
            {
                property: 'nature',
                visible: true,
                label: ('entities.TaxType.table.columns.nature'),
                type: 'text',
            },
            // {
            //     property: 'designation',
            //     visible: true,
            //     label: this.translocoService.translate('entities.TaxType.table.columns.designation'),
            //     type: 'text',
            // },
            // {
            //     property: 'rate',
            //     visible: true,
            //     label: this.translocoService.translate('entities.TaxType.table.columns.rate'),
            //     type: 'number',
            // },
            // {
            //     property: 'description',
            //     visible: true,
            //     label: this.translocoService.translate('entities.TaxType.table.columns.description'),
            //     type: 'text',
            // },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: TaxType, property: keyof TaxType) => {
            if (property === 'nature') {
                return (`entities.TaxType.nature.${element.nature}`);
            }
            return element[property];
        }
    };

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<TaxType> = new MatTableDataSource();
    selection = new SelectionModel<TaxType>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _TaxTypeService: TaxTypeService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TypeFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            taxtypes: TaxType[];
            product: Product;
            mode: 'add' | 'remove';
        },
        private _productService: ProductService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {
        this.formGroup = this.formBuilder.group({
            taxtypes: [[], Validators.required],
        });
    }

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;


    ngOnInit(): void {
        this._TaxTypeService.taxTypes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxType[]) => {
                this.dataSource.data = data;

                this.selection.clear();

                // If the data is not empty, set the selected taxtypes from the data
                if (this.data.taxtypes && this.data.taxtypes.length > 0) {
                    this.selection.select(...this.data.taxtypes);
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
        this.formGroup.get('taxtypes')?.setValue(this.selection.selected);
    }

    toggleSelection(row: TaxType) {
        this.selection.toggle(row);
        // add or remove the element from the selection
        this.formGroup.get('taxtypes')?.setValue(this.selection.selected);
    }


    trackByProperty(index: number, column: TableColumn<TaxType>) {
        return column.property;
    }

    onSubmit() {

        const taxtypes = this.selection.selected.map((coverage: TaxType) => coverage.id);

        if (this.data.mode === 'add') {
            // Add taxtypes to the product
            this.formGroup.disable();
            const updated = {
                taxtypes: taxtypes,
            };

            // this._productService.addtaxtypes(this.data.product.id, updated).subscribe({
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
            // Remove taxtypes from the product
            // this.formGroup.disable();
            // const updated = {
            //     taxtypes: taxtypes,
            // };

            // this._productService.removetaxtypes(this.data.product.id, updated).subscribe({
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
