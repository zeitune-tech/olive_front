import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "@core/services/administration/product/product.interface";
import { ProductService } from "@core/services/administration/product/product.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-products-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ProductsListComponent {

  
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Product> = {
        title: '',
        columns: [
            { label: 'entities.product.table.columns.name', property: 'name', type: 'text', visible: true },
            { label: 'entities.product.table.columns.description', property: 'description', type: 'text', visible: true },
            { label: 'entities.product.table.columns.branch', property: 'branch', type: 'text', visible: true },
            { label: 'entities.product.table.columns.category', property: 'category', type: 'text', visible: true },
        ],
        imageOptions: {
            label: 'product.columns.logo',
            property: 'logo',
            cssClasses: ['w-16 h-16']
        },
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            
        ],
        renderItem: (element: Product, property: keyof Product) => {
            
            if (property === 'branch') {
                return element.branch?.name;
            }

            if (property === 'category') {
                return element.category?.name;
            }
            
            return element[property];
        },
    };
    data: Product[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Product> = new MatTableDataSource();
    selection = new SelectionModel<Product>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _productService: ProductService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._productService.products$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Product[]) => {
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
        * Edit Product Product
        */
    onDemand(item: Product | null): void {
      
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Product>) {
        return column.property;
    }
}