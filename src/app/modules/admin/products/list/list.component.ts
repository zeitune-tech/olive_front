import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { PermissionsService } from "@core/permissions/permissions.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { Product } from "@core/services/administration/product/product.interface";
import { ProductService } from "@core/services/administration/product/product.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { LayoutService } from "../layout.service";
import { Router } from "@angular/router";
import { ShareProductComponent } from "../share-product/share-product.component";

@Component({
    selector: "app-products-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class ProductsListComponent implements OnInit {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions: TableOptions<Product> = {
        title: '',
        columns: [
            { label: 'entities.product.table.columns.name', property: 'name', type: 'text', visible: true },
            { label: 'entities.product.table.columns.branch', property: 'branch', type: 'text', visible: true },
            { label: 'entities.product.table.columns.category', property: 'category', type: 'text', visible: true },
            { label: 'entities.product.table.columns.visibility', property: 'visibility', type: 'text', visible: true },
            { label: 'entities.product.table.columns.minRisk', property: 'minRisk', type: 'text', visible: true },
            { label: 'entities.product.table.columns.maxRisk', property: 'maxRisk', type: 'text', visible: true },
            { label: 'entities.product.table.columns.minimumGuaranteeNumber', property: 'minimumGuaranteeNumber', type: 'text', visible: true },
            { label: 'entities.product.table.columns.fleet', property: 'fleet', type: 'text', visible: true },
            { label: 'entities.product.table.columns.hasReduction', property: 'hasReduction', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [

        ],
        renderItem: (element: Product, property: keyof Product) => {
            if (property === 'branch') {
                return element.branch.name;
            } else if (property === 'fleet') {
                return element.fleet ? 'Yes' : 'No';
            } else if (property === 'hasReduction') {
                return element.hasReduction ? 'Yes' : 'No';
            } else if (property === 'category') {
                return element.branch.category.name;
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

    managementEntity: ManagementEntity = new ManagementEntity({});

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _productService: ProductService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _layoutService: LayoutService,
        private _router: Router,
        private _dialog: MatDialog
    ) {
        this._productService.products$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: Product[]) => {
                this.data = data;
                this.dataSource.data = data;
                this._changeDetectorRef.detectChanges();
            });

        this._managementEntityService.entity$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: ManagementEntity) => {
                this.managementEntity = data;
            });
    }

    ngOnInit(): void { }

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
    onEdit(product: Product): void {
        this._layoutService.setSelectedProduct(product);
        this._router.navigate(['/administration/products/new']); // ou route vers le même formulaire mais dans un mode "édition"
    }

    onShare(product: Product): void {
        this._dialog.open(ShareProductComponent, {
            data: {
                product: product,
                companies: product.sharedWith,
            },
        }).afterClosed().subscribe((result) => {
            if (result) {
                
            }
        })
    }


    hasPermission(product: Product): boolean {
        let hasPerm = this._permissionService.hasPermission(PERMISSIONS.UPDATE_PRODUCTS);
        if (!hasPerm) {
            return false;
        } else if (this.managementEntity.type === "MARKET_LEVEL_ORGANIZATION") {
            return true;
        } else if (this.managementEntity.type === "COMPANY" && product.visibility === "PRIVATE") {
            return true;
        } else
            return false;
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