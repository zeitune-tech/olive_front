import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { User } from "@core/services/auth/user/user.interface";
import { UserService } from "@core/services/auth/user/user.service";
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
    searchCtrl: UntypedFormControl = new UntypedFormControl('');
        
    tableOptions: TableOptions<User> = {
        title: '',
        columns: [
            { label: 'entities.user.fields.first_name', property: 'firstName', type: 'text', visible: true },
            { label: 'entities.user.fields.last_name', property: 'lastName', type: 'text', visible: true },
            { label: 'entities.user.fields.email', property: 'email', type: 'text', visible: true },
            { label: 'entities.user.fields.profiles', property: 'profiles', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: User, property: keyof User) => {
            
            if (property === 'managementEntity') {
                return element.managementEntity;
            }

            if (property === 'profiles') {
                return element.profiles.map(profile => profile.name).join(', ');
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

    onBlock(user: User) {
        // Implement block user logic here
    }
    onUnblock(user: User) {
        // Implement unblock user logic here
    }

    get visibleColumns() {
        const columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<User>) {
        return column.property;
    }
}