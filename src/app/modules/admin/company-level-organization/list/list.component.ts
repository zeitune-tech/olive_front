import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CompanyLevelOrganization } from "@core/services/company-level-organization/company-level-organization.interface";
import { CompanyLevelOrganizationService } from "@core/services/company-level-organization/company-level-organization.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-company-level-organization-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class CompanyLevelOrganizationListComponent {

    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<CompanyLevelOrganization> = {
        title: '',
        columns: [
            { label: 'entities.company_level_organization.table.columns.name', property: 'name', type: 'text', visible: true },
            { label: 'entities.company_level_organization.table.columns.points_of_sale_count', property: 'pointsOfSale', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            
        ],
        renderItem: (element: CompanyLevelOrganization, property: keyof CompanyLevelOrganization) => {
            
            return element[property];
        },
    };
    data: CompanyLevelOrganization[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CompanyLevelOrganization> = new MatTableDataSource();
    selection = new SelectionModel<CompanyLevelOrganization>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _companyLevelOrganizationService: CompanyLevelOrganizationService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._companyLevelOrganizationService.companyLevelOrganizations$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: CompanyLevelOrganization[]) => {
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
        * Edit CompanyLevelOrganization CompanyLevelOrganization
        */
    onDemand(item: CompanyLevelOrganization | null): void {
      
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<CompanyLevelOrganization>) {
        return column.property;
    }
}