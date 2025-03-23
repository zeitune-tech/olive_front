import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Profile } from "@core/services/profile/profile.interface";
import { ProfileService } from "@core/services/profile/profile.service";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-profiles-list",
    templateUrl: "./list.component.html",
})
export class ProfilesListComponent {

    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Profile> = {
        title: '',
        columns: [
            { label: 'profile.columns.name', property: 'name', type: 'text', visible: true },
            { label: 'profile.columns.description', property: 'description', type: 'text', visible: true },
            { label: 'profile.columns.permissions', property: 'permissions', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'profile.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            
        ],
        renderItem: (element: Profile, property: keyof Profile) => {
            
            if (property === 'permissions') {
                return element[property].length;
            }
            return element[property];
        },
    };
    data: Profile[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Profile> = new MatTableDataSource();
    selection = new SelectionModel<Profile>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _profileService: ProfileService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._profileService.profiles$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Profile[]) => {
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
        * Edit Profile Profile
        */
    onDemand(item: Profile | null): void {
      
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Profile>) {
        return column.property;
    }
}