import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MarketLevelOrganization } from "@core/services/market-level-organization/market-level-organization.interface";
import { MarketLevelOrganizationService } from "@core/services/market-level-organization/market-level-organization.service";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject } from "rxjs";

@Component({
    selector: "app-linked-entity-superior-list",
    templateUrl: "./linked-list.component.html",
    animations: animations
})
export class LinkedMarketLevelOrganizationListComponent {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<MarketLevelOrganization> = {
        title: '',
        columns: [
            { label: 'company.columns.logo', property: 'logo', type: 'image', visible: true },
            { label: 'company.columns.name', property: 'name', type: 'text', visible: true},
            { label: 'company.columns.email', property: 'email', type: 'text', visible: true},
            { label: 'company.columns.phone', property: 'phone', type: 'text', visible: true},
            { label: 'company.columns.address', property: 'address', type: 'text', visible: true},
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'company.actions.demand', icon: 'demand', action: this.onDemand.bind(this) },
        ],
        imageOptions: {
            label: 'company.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        renderItem: (element: MarketLevelOrganization, property: keyof MarketLevelOrganization) => {
            
            return element[property];
        },
    };
    data: MarketLevelOrganization[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<MarketLevelOrganization> = new MatTableDataSource();
    selection = new SelectionModel<MarketLevelOrganization>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _marketLevelOrganizationService: MarketLevelOrganizationService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._marketLevelOrganizationService.entitiesSuperiorLinked$
        .subscribe((data: MarketLevelOrganization[]) => {
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
    */
    onDemand(item: MarketLevelOrganization | null): void {
        
    }


    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
        // return this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
    }

    trackByProperty(index: number, column: TableColumn<MarketLevelOrganization>) {
        return column.property;
    }
}