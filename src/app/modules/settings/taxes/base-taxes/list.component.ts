import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { BaseTax } from "@core/services/settings/base-tax/base-tax.interface";
import { BaseTaxService } from "@core/services/settings/base-tax/base-tax.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-basetax-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class BaseTaxesListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<BaseTax> = {
        title: '',
        columns: [
            { label: 'entities.base_tax.fields.dateEffective', property: 'dateEffective', type: 'text', visible: true },
            { label: 'entities.base_tax.fields.product', property: 'product', type: 'text', visible: true },
            { label: 'entities.base_tax.fields.coverage', property: 'coverage', type: 'text', visible: true },
            { label: 'entities.base_tax.fields.calculationBase', property: 'calculationBase', type: 'text', visible: false },
            { label: 'entities.base_tax.fields.tax', property: 'tax', type: 'text', visible: true },
            { label: 'entities.base_tax.fields.isFlat', property: 'isFlat', type: 'text', visible: true },
            { label: 'entities.base_tax.fields.fixedAmount', property: 'fixedAmount', type: 'text', visible: true },
            { label: 'entities.base_tax.fields.rate', property: 'rate', type: 'text', visible: true }
        ],
        imageOptions: {
            label: 'base_taxes.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: BaseTax, property: keyof BaseTax) => {

            if (property === 'tax') {
                return element.tax?.designation;
            }

            if (property === 'coverage') {
                return element.coverage?.designation
            }

            if (property === 'product') {
                return element.product?.name
            }

            if (property === 'rate') {
                return element.isFlat ? '-' : element.rate;
            }

            if (property === 'fixedAmount') {
                return element.isFlat ? element.fixedAmount : '-';
            }
          
            return element[property];
        },
    };
    data: BaseTax[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<BaseTax> = new MatTableDataSource();
    selection = new SelectionModel<BaseTax>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _baseTaxService: BaseTaxService,
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this._baseTaxService.baseTaxes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: BaseTax[]) => {
                this.data = data;
                this.dataSource.data = data;
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


    refreshBaseTaxList(): void {
        this._baseTaxService.getAll().subscribe((data: BaseTax[]) => {
            this.data = data;
            this.dataSource.data = data;
            this._changeDetectorRef.detectChanges();
        });
    }

    openAddDialog(): void {
        this._router.navigate(['parameters/taxes/base-taxes-new']);
    }
    onEdit(element: BaseTax): void {
        // Implement edit functionality here
    }
    onView(element: BaseTax): void {
        // Implement view functionality here
    }
    onDelete(element: BaseTax): void {
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<BaseTax>) {
        return column.property;
    }
}