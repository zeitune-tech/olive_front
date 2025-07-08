import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CompanyLevelOrganization } from "@core/services/administration/company-level-organization/company-level-organization.interface";
import { CompanyLevelOrganizationService } from "@core/services/administration/company-level-organization/company-level-organization.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { CompanyLevelOrganizationEditComponent } from "../edit/edit.component";
import { ConfirmDeleteComponent } from "@shared/components/confirm-delete/confirm-delete.component";
import { CompanyLevelOrganizationPointsOfSaleComponent } from "../details/details.component";

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
            { label: 'entities.company_level_organization.fields.name', property: 'name', type: 'text', visible: true },
            { label: 'entities.company_level_organization.fields.description', property: 'description', type: 'text', visible: true },
            { label: 'entities.company_level_organization.fields.points_of_sale_count', property: 'pointsOfSale', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: CompanyLevelOrganization, property: keyof CompanyLevelOrganization) => {
            
            if (property === 'pointsOfSale') {
                return element[property].length;
            }
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

    onEdit(element: CompanyLevelOrganization): void {
        const dialogRef = this._dialog.open(CompanyLevelOrganizationEditComponent, {
            width: '600px',
            data: element
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._companyLevelOrganizationService.getAll().subscribe();
            }
        });
    }

    onDelete(element: CompanyLevelOrganization): void {
        const dialogRef = this._dialog.open(ConfirmDeleteComponent, {
            width: '400px',
            data: {
                title: 'form.actions.deleteTitle',
                message: 'form.actions.deleteMessage',
                itemName: element.name
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._companyLevelOrganizationService.delete(element.id).subscribe({
                    next: () => {
                        this._companyLevelOrganizationService.getAll().subscribe();
                    },
                    error: () => {
                        // Handle error case
                    }
                });
            }
        });
    }

    onView(element: CompanyLevelOrganization): void {
        this._dialog.open(CompanyLevelOrganizationPointsOfSaleComponent, {
            width: '600px',
            data: element
        }).afterClosed().subscribe(result => {
            if (result) {
                // Handle any actions after viewing points of sale
            }
        })
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