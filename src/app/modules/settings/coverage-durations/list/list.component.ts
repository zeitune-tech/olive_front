import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CoverageDuration } from "@core/services/settings/coverage-duration/coverage-duration.interface";
import { CoverageDurationService } from "@core/services/settings/coverage-duration/coverage-duration.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-coverage-durations-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class CoverageDurationsListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<CoverageDuration> = {
        title: '',
        columns: [
            { label: 'entities.coverage_duration.fields.designation', property: 'designation', type: 'text', visible: true },
            { label: 'entities.coverage_duration.fields.type', property: 'type', type: 'text', visible: true },
            { label: 'entities.coverage_duration.fields.from', property: 'from', type: 'text', visible: true },
            { label: 'entities.coverage_duration.fields.to', property: 'to', type: 'text', visible: true },
            { label: 'entities.coverage_duration.fields.unit', property: 'unit', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: CoverageDuration, property: keyof CoverageDuration) => {

            if(property === 'type') {
                return this._translateService.translate('entities.coverage_duration.options.type.' + element.type.toLowerCase());
            }
            if(property === 'unit') {
                return  this._translateService.translate('entities.coverage_duration.options.unit.' + element.unit.toLowerCase());
            }
        
            return element[property];
        },
    };
    data: CoverageDuration[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CoverageDuration> = new MatTableDataSource();
    selection = new SelectionModel<CoverageDuration>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _coverageDurationService: CoverageDurationService,
        private _translateService: TranslocoService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._coverageDurationService.coverageDurations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: CoverageDuration[]) => {
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
        * EditCoverageDurationCoverageDuration
        */
    onEdit(coverageDuration: CoverageDuration): void {}
    onDelete(coverageDuration: CoverageDuration): void {} 
    onView(coverageDuration: CoverageDuration): void {}
    
    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<CoverageDuration>) {
        return column.property;
    }
}