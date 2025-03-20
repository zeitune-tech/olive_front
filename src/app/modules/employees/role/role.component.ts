import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Role } from "@core/services/employee/employee.inteface";
import { EmployeeService } from "@core/services/employee/employee.service";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { NewRoleComponent } from "../new-role/new-role.component";

@Component({
    selector: "app-employees-role",
    templateUrl: "./role.component.html",
})
export class EmployeesRoleComponent { 

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Role> = {
        title: '',
        columns: [
                { label: 'role.columns.name', property: 'name', type: 'text', visible: true },
                { label: 'role.columns.operations', property: 'operations', type: 'text', visible: true},
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'role.actions.edit', icon: 'edit', action: this.editItem.bind(this) },
            { label: 'role.actions.delete', icon: 'delete', action: this.deleteItem.bind(this) }
        ],
        renderItem: (element: Role, property: keyof Role) => {
            if (property === 'operations') {
                return element.operations.length;
            }
            return element[property];
        },
    };
    data: Role[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Role> = new MatTableDataSource();
    selection = new SelectionModel<Role>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _employeeService: EmployeeService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._employeeService.roles$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Role[]) => {
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

    addItem(): void {
        this._dialog.open(NewRoleComponent, {
            panelClass: 'role-form-dialog',
            data: {
                action: 'new'
            }
        });
    }

    /**
        * Edit Role Role
        */
    editItem(item: Role | null): void {
        
    }

    /**
        * Delete Role Role
        */
    deleteItem(item: Role): void {
        
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Role>) {
        return column.property;
    }
}