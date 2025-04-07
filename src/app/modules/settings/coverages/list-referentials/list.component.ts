import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CoverageReference } from "@core/services/settings/coverage-referential/coverage-referential.interface";
import { CoverageReferentialService } from "@core/services/settings/coverage-referential/coverage-referential.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-coverage-referentials-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class CoverageReferentialsListComponent {

  
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<CoverageReference> = {
        title: '',
        columns: [
            { label: 'entities.coverage_reference.table.columns.designation', property: 'designation', type: 'text', visible: true },
            { label: 'entities.coverage_reference.table.columns.family', property: 'family', type: 'text', visible: true },
            { label: 'entities.coverage_reference.table.columns.accessCharacteristic', property: 'accessCharacteristic', type: 'text', visible: true },
            { label: 'entities.coverage_reference.table.columns.tariffAccess', property: 'tariffAccess', type: 'text', visible: true },
            { label: 'entities.coverage_reference.table.columns.managementEntity', property: 'managementEntity', type: 'text', visible: true }
        ],
        imageOptions: {
            label: 'coverage-referential.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            
        ],
        renderItem: (element: CoverageReference, property: keyof CoverageReference) => {
            
            return element[property];
        },
    };
    data: CoverageReference[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CoverageReference> = new MatTableDataSource();
    selection = new SelectionModel<CoverageReference>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _coverageReferentialService: CoverageReferentialService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._coverageReferentialService.coverageReferentials$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: CoverageReference[]) => {
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
        * Edit CoverageReferential CoverageReferential
        */
    onDemand(item: CoverageReference | null): void {
      
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<CoverageReference>) {
        return column.property;
    }
}