import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MarketLevelOrganization } from "@core/services/administration/market-level-organization/market-level-organization.interface";
import { MarketLevelOrganizationService } from "@core/services/administration/market-level-organization/market-level-organization.service";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-entity-superior-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class MarketLevelOrganizationListComponent { 

    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<MarketLevelOrganization> = {
        title: '',
        columns: [
            { label: 'entities.management_entity.fields.logo', property: 'logo', type: 'image', visible: true },
            { label: 'entities.management_entity.fields.name', property: 'name', type: 'text', visible: true},
            { label: 'entities.management_entity.fields.email', property: 'email', type: 'text', visible: true},
            { label: 'entities.management_entity.fields.phone', property: 'phone', type: 'text', visible: true},
            { label: 'entities.management_entity.fields.address', property: 'address', type: 'text', visible: true},
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        imageOptions: {
            label: 'entities.management_entity.fields.logo',
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
    selectedItem: MarketLevelOrganization | null = null;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _entitySuperiorService: MarketLevelOrganizationService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._entitySuperiorService.marketLevelOrganizations$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((marketLevelOrganizations: MarketLevelOrganization[]) => {
            this.data = marketLevelOrganizations;
            this.dataSource.data = marketLevelOrganizations;
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

    drawerOpened = false;

    onView(element: MarketLevelOrganization): void {
        this.selectedItem = element;
        this.drawerOpened = true;
    }

    onClose(): void {
        this.selectedItem = null;
        this.drawerOpened = false;
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<MarketLevelOrganization>) {
        return column.property;
    }
}