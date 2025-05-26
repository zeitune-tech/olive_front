import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Contributor } from "@core/services/administration/contributor/contributor.interface";
import { ContributorService } from "@core/services/administration/contributor/contributor.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-contributors-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ContributorsListComponent {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Contributor> = {
        title: '',
        columns: [
            { label: 'entities.contributor.fields.firstname', property: 'firstname', type: 'text', visible: true },
            { label: 'entities.contributor.fields.lastname', property: 'lastname', type: 'text', visible: true },
            { label: 'entities.contributor.fields.email', property: 'email', type: 'text', visible: true },
            { label: 'entities.contributor.fields.level', property: 'level', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'entities.contributor.fields.actions.edit', icon: 'edit', action: this.editItem.bind(this) },
            { label: 'entities.contributor.fields.actions.delete', icon: 'delete', action: this.deleteItem.bind(this) },
            { label: 'entities.contributor.fields.actions.attribute-attestation', icon: 'delete', action: this.attribute.bind(this) }
        ],
        renderItem: (element: Contributor, property: keyof Contributor) => {
            if (property === 'level') {
                return this._translateService.translate(`entities.contributor.options.level.${element[property]}`);
            }
            return element[property];
        },
    };
    data: Contributor[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Contributor> = new MatTableDataSource();
    selection = new SelectionModel<Contributor>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _contributorService: ContributorService,
        private _translateService: TranslocoService ,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._contributorService.contributors$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Contributor[]) => {
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

    attribute(item: Contributor | null): void {
       
    }

    /**
        * Edit Contributor Contributor
        */
    editItem(item: Contributor | null): void {
        
    }

    /**
        * Delete Contributor Contributor
        */
    deleteItem(item: Contributor): void {
        
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        // columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Contributor>) {
        return column.property;
    }
}