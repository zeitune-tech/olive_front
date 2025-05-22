import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CommissionTax } from "@core/services/settings/commission-tax/commission-tax.interface";
import { CommissionTaxService } from "@core/services/settings/commission-tax/commission-tax.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-closures-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class TaxesListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<CommissionTax> = {
        title: '',
        columns: [
            { label: 'entities.commission_tax.fields.dateEffective', property: 'dateEffective', type: 'text', visible: true },
            { label: 'entities.commission_tax.fields.pointOfSale', property: 'pointOfSale', type: 'text', visible: true },
            { label: 'entities.commission_tax.fields.commissionTaxType', property: 'commissionTaxType', type: 'text', visible: true },
            { label: 'entities.commission_tax.fields.product', property: 'product', type: 'text', visible: true }
        ],
        imageOptions: {
            label: 'commission_tax.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: CommissionTax, property: keyof CommissionTax) => {

            if (property === 'pointOfSale') {
                return element.pointOfSale?.name;
            }

            if (property === 'product') {
                return element.product?.name;
            }

             
            return element[property];
        },
    };
    data: CommissionTax[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CommissionTax> = new MatTableDataSource();
    selection = new SelectionModel<CommissionTax>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _commissionTax: CommissionTaxService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._commissionTax.commissionTaxes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: CommissionTax[]) => {
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

    /**
        * Edit CommissionTax CommissionTax
        */
    onDemand(item: CommissionTax | null): void {

    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<CommissionTax>) {
        return column.property;
    }
}