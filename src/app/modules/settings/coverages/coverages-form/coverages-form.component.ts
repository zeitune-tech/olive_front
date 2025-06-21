import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChild } from "@angular/core";
import { UntypedFormControl, FormBuilder, Validators, UntypedFormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CoverageReference } from "@core/services/settings/coverage-reference/coverage-reference.interface";
import { CoverageReferenceService } from "@core/services/settings/coverage-reference/coverage-reference.service";
import { Product } from "@core/services/settings/product/product.interface";
import { ProductService } from "@core/services/settings/product/product.service";
import { TranslocoService } from "@jsverse/transloco";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { ProductEditComponent } from "../../products/edit/edit.component";

@Component({
    selector: "app-coverages-form",
    templateUrl: "./coverages-form.component.html",
})
export class CoveragesFormComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();


    tableOptions: TableOptions<CoverageReference> = {
        title: '',
        columns: [
            { label: 'entities.coverage_reference.fields.designation', property: 'designation', visible: true, type: 'text' },
            { label: 'entities.coverage_reference.fields.family', property: 'family', visible: true, type: 'text' },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: CoverageReference, property: keyof CoverageReference) => {
            return element[property];
        },
    };

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CoverageReference> = new MatTableDataSource();
    selection = new SelectionModel<CoverageReference>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _coverageReferenceService: CoverageReferenceService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ProductEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            coverages: CoverageReference[];
            product: Product;
            mode: 'add' | 'remove';
        },
        private _productService: ProductService,
        private translocoService: TranslocoService,
        private snackBar: MatSnackBar
    ) {
        this.formGroup = this.formBuilder.group({
            coverages: [[], Validators.required],
        });
    }

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;


    ngOnInit(): void {
        this._coverageReferenceService.coverageReferences$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: CoverageReference[]) => {
                this.dataSource.data = data;

                this.selection.clear();

                // If the data is not empty, set the selected coverages from the data
                if (this.data.coverages && this.data.coverages.length > 0) {
                    this.selection.select(...this.data.coverages);
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
        this.formGroup.get('coverages')?.setValue(this.selection.selected);
    }

    toggleSelection(row: CoverageReference) {
        this.selection.toggle(row);
        // add or remove the element from the selection
        this.formGroup.get('coverages')?.setValue(this.selection.selected);
    }


    trackByProperty(index: number, column: TableColumn<CoverageReference>) {
        return column.property;
    }

    onSubmit() {

        const coverages = this.selection.selected.map((coverage: CoverageReference) => coverage.id);

        if (this.data.mode === 'add') {
            // Add coverages to the product
            this.formGroup.disable();
            const updated = {
                coverages: coverages,
            };

            this._productService.addCoverages(this.data.product.id, updated).subscribe({
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
        } else if (this.data.mode === 'remove') {
            // Remove coverages from the product
            this.formGroup.disable();
            const updated = {
                coverages: coverages,
            };

            this._productService.removeCoverages(this.data.product.id, updated).subscribe({
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
      
    }

    onCancel() {}
}
