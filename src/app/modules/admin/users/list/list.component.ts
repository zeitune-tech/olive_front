import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { User } from "@core/services/user/user.interface";
import { UserService } from "@core/services/user/user.service";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-users-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class UsersListComponent {
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<User> = {
        title: '',
        columns: [
            { label: 'entities.user.table.columns.first_name', property: 'firstName', type: 'text', visible: true },
            { label: 'entities.user.table.columns.last_name', property: 'lastName', type: 'text', visible: true },
            { label: 'entities.user.table.columns.email', property: 'email', type: 'text', visible: true },
            { label: 'entities.user.table.columns.management_entity', property: 'managementEntity', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'company.actions.edit', icon: 'edit', action: this.editItem.bind(this) },
            { label: 'company.actions.delete', icon: 'delete', action: this.deleteItem.bind(this) }
        ],
        renderItem: (element: User, property: keyof User) => {
            
            if (property === 'managementEntity') {
                return element.managementEntity?.name;
            }
            return element[property];
        },
    };
    data: User[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<User> = new MatTableDataSource();
    selection = new SelectionModel<User>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._userService.users$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: User[]) => {
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
        * Edit User User
        */
    editItem(item: User | null): void {
        
    }

    /**
        * Delete User User
        */
    deleteItem(item: User): void {
        
    }
    
    get visibleColumns() {
        const columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        // columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<User>) {
        return column.property;
    }
}