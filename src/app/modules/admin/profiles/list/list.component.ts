import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { PermissionsService } from "@core/permissions/permissions.service";
import { Profile } from "@core/services/auth/profile/profile.interface";
import { ProfileService } from "@core/services/auth/profile/profile.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { LayoutService } from "../layout.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-profiles-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ProfilesListComponent {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Profile> = {
        title: '',
        columns: [
            { label: 'entities.profile.fields.name', property: 'name', type: 'text', visible: true },
            { label: 'entities.profile.fields.description', property: 'description', type: 'text', visible: true },
            { label: 'entities.profile.fields.level', property: 'level', type: 'text', visible: true },
            { label: 'entities.profile.fields.permissions_count', property: 'permissions', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'entities.profile.fields.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            
        ],
        renderItem: (element: Profile, property: keyof Profile) => {
            if (property === 'level') {
                return this._translateService.translate('entities.management_entity.options.level.' + element[property]);
            }

            if (property === 'permissions') {
                return element[property].length;
            }

            if (property === 'description') {
                if (element[property] && element[property].includes("profiles.descriptions")) {

                    return this._translateService.translate(element[property]);
                }
            
                if (element[property] && element[property].length > 50) {
                    return element[property].substring(0, 50) + '...';
                }
            }

            if (element[property] === null) {
                return "-";
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
        private _translateService: TranslocoService,
        private _permissionService: PermissionsService,
        private _layoutService: LayoutService,
        private _router: Router
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


    hasPermission(): boolean {
        let hasPerm = this._permissionService.hasPermission(PERMISSIONS.UPDATE_PROFILES);
        return hasPerm;
    }

    onEditProfile(profile: Profile): void {
        this._layoutService.setSelectedProfile(profile);
        this._router.navigate(['/administration/profiles/new']);
    }

    onDeleteProfile(profile: Profile): void {
        // this._profileService.deleteProfile(profile.id).subscribe(() => {
        //     this.data = this.data.filter(p => p.id !== profile.id);
        //     this.dataSource.data = this.data;
        //     this._changeDetectorRef.detectChanges();
        // });
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