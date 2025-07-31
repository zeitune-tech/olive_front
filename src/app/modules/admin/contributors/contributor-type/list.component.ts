import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ContributorType } from "@core/services/administration/contributor/contributor.interface";
import { ContributorService } from "@core/services/administration/contributor/contributor.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { ContributorFormComponent } from "../edit/edit.component";
import { ConfirmDeleteComponent } from "@shared/components/confirm-delete/confirm-delete.component";
import { ContributorTypeFormComponent } from "../contributor-type-form/form.component";
import { AccountComponent } from "../account/account.component";

@Component({
    selector: "app-contributors-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ContributorsTypeListComponent {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<ContributorType> = {
        title: '',
        columns: [
            { label: 'entities.contributor-type.fields.label', property: 'label', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: ContributorType, property: keyof ContributorType) => {

            return element[property];
        }

    };
    data: ContributorType[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<ContributorType> = new MatTableDataSource();
    selection = new SelectionModel<ContributorType>(true, []);
    searchControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _contributorService: ContributorService,
        private _translateService: TranslocoService ,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._contributorService.contributorTypes$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: ContributorType[]) => {
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

    onCreate(): void {
        const dialogRef = this._dialog.open(ContributorTypeFormComponent, {
            width: '600px',
            data: {
                mode: 'create',
                contributorType: { label: '' } as ContributorType
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                // this._contributorService.refreshContributors();
            }
        });
    }

    onEdit(element: ContributorType): void {

        const dialogRef = this._dialog.open(ContributorTypeFormComponent, {
            width: '600px',
            data: {
                mode: 'edit',
                contributorType: element
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // this._contributorService.refreshContributors();
            }
        });
    }

    

    onView(element: ContributorType): void {
        const dialogRef = this._dialog.open(AccountComponent, {
            width: '600px',
            data: {
                mode: 'view',
                contributor: element
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // this._contributorService.refreshContributors();
            }
        });
    }

    onDelete(element: ContributorType): void {
        this._dialog.open(ConfirmDeleteComponent, {
            width: '400px',
            data: {
                title: 'form.actions.deleteTitle',
                message: 'form.actions.deleteMessage',
                confirmButtonText: 'actions.delete',
                cancelButtonText: 'actions.cancel'
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                this._contributorService.contributors$;
            }
        })
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<ContributorType>) {
        return column.property;
    }
}