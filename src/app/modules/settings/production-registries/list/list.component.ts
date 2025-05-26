import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ProductionRegistry } from "@core/services/settings/production-registry/production-registry.interface";
import { ProductionRegistryService } from "@core/services/settings/production-registry/production-registry.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-production-registries-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ProductionRegistriesListComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<ProductionRegistry> = {
        title: '',
        columns: [
            { label: 'entities.production_registry.fields.prefix', property: 'prefix', type: 'text', visible: true },
            { label: 'entities.production_registry.fields.length', property: 'length', type: 'text', visible: true },
            { label: 'entities.production_registry.fields.counter', property: 'counter', type: 'text', visible: true },
            { label: 'entities.production_registry.fields.product', property: 'product', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'production_registrie.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: ProductionRegistry, property: keyof ProductionRegistry) => {
            if (property === 'product') {
                return element.product ? element.product.name : '';
            }
            return element[property];
        },
    };
    data: ProductionRegistry[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<ProductionRegistry> = new MatTableDataSource();
    selection = new SelectionModel<ProductionRegistry>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _productionRegistrieService: ProductionRegistryService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._productionRegistrieService.productionRegistries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: ProductionRegistry[]) => {
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
        * Edit ProductionRegistry ProductionRegistry
        */
    onDemand(item: ProductionRegistry | null): void {

    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<ProductionRegistry>) {
        return column.property;
    }
}