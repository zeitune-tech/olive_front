import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Commission } from "@core/services/settings/commission/commission.interface";
import { CommissionService } from "@core/services/settings/commission/commission.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-closures-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class CommissionListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<Commission> = {
        title: '',
        columns: [
            { label: 'entities.commission.fields.dateEffective', property: 'dateEffective', type: 'text', visible: true },
            { label: 'entities.commission.fields.product', property: 'product', type: 'text', visible: true },
            { label: 'entities.commission.fields.calculationBase', property: 'calculationBase', type: 'text', visible: true },
            { label: 'entities.commission.fields.pointOfSale', property: 'pointOfSale', type: 'text', visible: true },
            { label: 'entities.commission.fields.managementRate', property: 'managementRate', type: 'text', visible: true },
            { label: 'entities.commission.fields.contributionRate', property: 'contributionRate', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'closure.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: Commission, property: keyof Commission) => {

            if (property === "product") {
                return element.product ? element.product.name : '';
            }

            if (property === "pointOfSale") {
                return element.pointOfSale ? element.pointOfSale.name : '';
            }

            if (property === "calculationBase") {
                return this._translateService.translate(`entities.commission.options.calculationBase.${element.calculationBase}`);
            }

            return element[property];
        },
    };
    data: Commission[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Commission> = new MatTableDataSource();
    selection = new SelectionModel<Commission>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _commisionService: CommissionService,
        private _translateService: TranslocoService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._commisionService.commissions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Commission[]) => {
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

    onEdit(commission: Commission): void {}
    onView(commission: Commission): void {}
    onDelete(commission: Commission): void {}

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Commission>) {
        return column.property;
    }
}