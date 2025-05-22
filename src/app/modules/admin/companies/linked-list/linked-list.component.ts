import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { PermissionsService } from "@core/permissions/permissions.service";
import { UserService } from "@core/services/auth/user/user.service";
import { User } from "@core/services/auth/user/user.interface";
import { animations } from "@lhacksrt/animations";
import { Company } from "@core/services/administration/company/company.interface";
import { CompanyService } from "@core/services/administration/company/company.service";

@Component({
    selector: "app-linked-companies-list",
    templateUrl: "./linked-list.component.html",
    animations: animations
})
export class LinkedCompaniesListComponent {

    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    permissions = {
        demand: false,
        attribute: false
    };
    
        
    tableOptions: TableOptions<Company> = {
        title: '',
        columns: [
            { label: 'entities.company.fields.logo', property: 'logo', type: 'image', visible: true },
            { label: 'entities.company.fields.name', property: 'name', type: 'text', visible: true },
            { label: 'entities.company.fields.email', property: 'email', type: 'text', visible: true },
            { label: 'entities.company.fields.phone', property: 'phone', type: 'text', visible: true },
            { label: 'entities.company.fields.address', property: 'address', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        imageOptions: {
            label: 'entities.company.fields.logo',
            property: 'logo',
            cssClasses: ['object-cover'],
        },
        actions: [],
        renderItem: (element: Company, property: keyof Company) => {
            
            return element[property];
        },
    };
    data: Company[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Company> = new MatTableDataSource();
    selection = new SelectionModel<Company>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    user: User;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _companyService: CompanyService,
        private _permissionsService: PermissionsService,
        private _userService: UserService,
        private _dialog: MatDialog
    ) {
        this.user = this._userService.user;
        this._userService.user$.subscribe((user) => {
            this.user = user;
            this.checkPermission();
        });
    }

    ngOnInit(): void {
        this._companyService.companiesLinked$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Company[]) => {
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
     * 
    */
    onDemand(item: Company | null): void {
        
    }

    onAttribute(item: any | null): void {
       
    }

    checkPermission() {
    
    }


    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        // columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Company>) {
        return column.property;
    }
}