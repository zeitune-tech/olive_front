import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CommissionContributor } from "@core/services/settings/commission-contributor/commission-contributor.interface";
import { CommissionContributorService } from "@core/services/settings/commission-contributor/commission-contributor.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-closures-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ContributorsListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<CommissionContributor> = {
        title: '',
        columns: [
            { label: 'entities.commission_contributor.fields.dateEffective', property: 'dateEffective', type: 'text', visible: true },
            { label: 'entities.commission_contributor.fields.contributor', property: 'contributor', type: 'text', visible: true },
            { label: 'entities.commission_contributor.fields.commissionBase', property: 'commissionBase', type: 'text', visible: true },
            { label: 'entities.commission_contributor.fields.upperEntityContributorRate', property: 'upperEntityContributorRate', type: 'text', visible: true },
            { label: 'entities.commission_contributor.fields.product', property: 'product', type: 'text', visible: true }
        ],
        imageOptions: {
            label: 'closure.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: CommissionContributor, property: keyof CommissionContributor) => {

            if (property === 'contributor') {
                return element.contributor?.name;
            }

            if (property === 'product') {
                return element.product?.name;
            }
            return element[property];
        },
    };
    data: CommissionContributor[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CommissionContributor> = new MatTableDataSource();
    selection = new SelectionModel<CommissionContributor>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _commissionContributorService: CommissionContributorService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._commissionContributorService.commissionContributors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: CommissionContributor[]) => {
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
        * Edit CommissionContributor CommissionContributor
        */
    onDemand(item: CommissionContributor | null): void {

    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<CommissionContributor>) {
        return column.property;
    }
}