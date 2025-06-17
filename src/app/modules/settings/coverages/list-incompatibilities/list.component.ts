import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/administration/product/product.interface";
import { IncompatibleCoverage } from "@core/services/settings/incompatible-coverage/incompatible-coverage.interface";
import { IncompatibleCoverageService } from "@core/services/settings/incompatible-coverage/incompatible-coverage.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { SelectProductComponent } from "../select-product/select-product.component";

@Component({
    selector: "app-incompatible-coverages-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class IncompatibleCoveragesListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchCtrl: UntypedFormControl = new UntypedFormControl('');

    tableOptions: TableOptions<IncompatibleCoverage> = {
        title: '',
        columns: [
            { label: 'entities.incompatible_coverage.fields.coverage', property: 'coverage', type: 'text', visible: true },
            { label: 'entities.incompatible_coverage.fields.incompatible', property: 'incompatibleCoverage', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'incompatibleCoverage.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: IncompatibleCoverage, property: keyof IncompatibleCoverage) => {
            if (property === "coverage") {
                return element[property].designation;
            }
            if (property === "incompatibleCoverage") {
                return element[property].designation;
            }
            return element[property];
        },
    };
    data: IncompatibleCoverage[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<IncompatibleCoverage> = new MatTableDataSource();
    selection = new SelectionModel<IncompatibleCoverage>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = {} as Product;
    products: Product[] = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _incompatibleCoverageService: IncompatibleCoverageService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._incompatibleCoverageService.incompatibleCoverages$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: IncompatibleCoverage[]) => {
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

    onEdit(element: IncompatibleCoverage): void {}
    onDelete(element: IncompatibleCoverage): void {}
    onView(element: IncompatibleCoverage): void {}

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<IncompatibleCoverage>) {
        return column.property;
    }
}