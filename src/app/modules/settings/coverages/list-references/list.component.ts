import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/settings/product/product.interface";
import { CoverageReference } from "@core/services/settings/coverage-reference/coverage-reference.interface";
import { CoverageReferenceService } from "@core/services/settings/coverage-reference/coverage-reference.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-coverage-reference-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class CoverageReferenceListComponent {

    searchCtrl: UntypedFormControl = new UntypedFormControl('');
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<CoverageReference> = {
        title: '',
        columns: [
            { label: 'entities.coverage_reference.fields.managementEntity', property: 'managementEntity', type: 'text', visible: true },
            { label: 'entities.coverage_reference.fields.designation', property: 'designation', type: 'text', visible: true },
            { label: 'entities.coverage_reference.fields.family', property: 'family', type: 'text', visible: true },
            { label: 'entities.coverage_reference.fields.accessCharacteristic', property: 'accessCharacteristic', type: 'text', visible: true },
            { label: 'entities.coverage_reference.fields.tariffAccess', property: 'tariffAccess', type: 'text', visible: true },
            { label: 'entities.coverage_reference.fields.toShareOut', property: 'toShareOut', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: CoverageReference, property: keyof CoverageReference) => {
            if (property === 'accessCharacteristic') {
                return element.accessCharacteristic == false ? 'Non' : 'Oui';
            }
            if (property === 'tariffAccess') {
                return element.tariffAccess == false ? 'Non' : 'Oui';
            }
            return element[property];
        },
    };
    data: CoverageReference[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<CoverageReference> = new MatTableDataSource();
    selection = new SelectionModel<CoverageReference>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _coverageService: CoverageReferenceService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._coverageService.coverageReferences$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: CoverageReference[]) => {
                this.data = data.map((coverage: CoverageReference) => {
                    return coverage as CoverageReference;
                });
                this.dataSource.data = this.data;
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

    openSelection() {
        
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