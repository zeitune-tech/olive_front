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
import { Product } from "@core/services/settings/product/product.interface";
import { ProductService } from "@core/services/settings/product/product.service";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { TranslocoService } from "@jsverse/transloco";
import { CommissionAccessoryContributorFormComponent } from "../form/form.component";
import { SelectDialogComponent } from "@shared/components/select-dialog/select-dialog.component";
import { CommissionContributorService } from "@core/services/settings/commission-contributor/commission-contributor.service";
import { CommissionContributor } from "@core/services/settings/commission-contributor/commission-contributor.interface";
import { ConfirmDeleteComponent } from "@shared/components/confirm-delete/confirm-delete.component";

@Component({
    selector: "app-products-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class CommissionAccessoryContributorListComponent implements OnInit {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<CommissionContributor>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    dataSource = new MatTableDataSource<CommissionContributor>([]); // Ajoute les données réelles ici

    constructor(
        private _productService: ProductService,
        private _commissionContributorService: CommissionContributorService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _tanslateService: TranslocoService,
        private _router: Router,
        private _dialog: MatDialog
    ) {

        this._commissionContributorService.commissionContributors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: CommissionContributor[]) => {
                this.data = data;
                this.dataSource.data = data;
            });

        this._managementEntityService.entity$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: ManagementEntity) => {
                this.managementEntity = data;
            });
    }


    data: CommissionContributor[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<CommissionContributor>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});




    ngOnInit(): void {
        // Initialisation de la configuration de la table
        this.tableOptions = {
            title: '',
            columns: [
                { property: 'contributor', type: 'text', label: 'entities.commission.fields.contributor', visible: true },
                { property: 'contributorType', type: 'text', label: 'entities.commission.fields.pointOfSale', visible: true },
                { property: 'managementRate', type: 'text', label: 'entities.commission.fields.managementRate', visible: true },
                { property: 'contributionRate', type: 'text', label: 'entities.commission.fields.contributionRate', visible: true },
                { property: 'dateEffective', type: 'text', label: 'entities.commission.fields.dateEffective', visible: true },
            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: CommissionContributor, property: keyof CommissionContributor) => {


                return element[property] ?? '--';
            },
        };

        // Construction des lignes d’en-tête
        this.buildHeaderRows();
    }

    buildHeaderRows(): void {
        this.tableOptions.columns.forEach(col => {
            if (col.type === 'collapse' && col.collapseOptions?.length) {
                // En-tête parent (ligne 1)
                const parent = col.property as string + '-parent';
                this.groupHeader.push(parent);

                // Sous-colonnes (ligne 2)
                col.collapseOptions.forEach(child => {
                    this.subHeader.push(child.property as string);
                    this.visibleColumns.push(child.property as string);
                });
            } else {
                // Colonne simple (même valeur dans les 2 lignes)
                this.groupHeader.push(col.property as string);

                this.visibleColumns.push(col.property as string);
            }
        });

        // Ajout de la colonne d’actions si nécessaire
        this.groupHeader.push('actions');
        this.visibleColumns.push('actions');
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

    products: Product[] = []
    searchCtrl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product = new Product({});


    openSelection() {
        this._dialog.open(SelectDialogComponent, {
            width: '700px',
            data: {
                items: this.products,
            }
        }).afterClosed().subscribe((product: Product) => {
            if (product) {
                this.selectedProduct = product;
                // this.dataSource.data = this.data.filter(coverage => coverage.product.id === this.selectedProduct.id);
                this.dataSource.paginator = this.paginator;
                // this._changeDetectorRef.detectChanges();
            }
        })
    }

    onAdd(): void {
        this._dialog.open(CommissionAccessoryContributorFormComponent, {
            width: '600px',
            disableClose: true,
        }).afterClosed().subscribe((result) => {
            if (result) {
                this._productService.getAll().subscribe();
            }
        });
    }

    onDelete(product: Product): void {
        this._dialog.open(ConfirmDeleteComponent, {
            data: product,
            width: '600px',
            disableClose: true,
        }).afterClosed().subscribe((result) => {
            if (result) {
                this._productService.getAll().subscribe();
            }
        });
    }

    /**
        * Edit Product Product
        */
    onEdit(product: Product): void {
        this._dialog.open(CommissionAccessoryContributorFormComponent, {
            data: product,
            width: '600px',
            disableClose: true,
        }).afterClosed().subscribe((result) => {
            if (result) {
                this._productService.getAll().subscribe();
            }
        })
    }



    onView(product: Product): void {
        //this._router.navigate(['/administration/products/list']);
    }

    onButtonClick(product: Product, column: string): void {
        if (column === 'productionRegistry') {
            alert('Production Registry button clicked for product: ' + product.name);
        }
    }

    hasPermission(product: CommissionContributor): boolean {

            return false;
    }


    trackByProperty(index: number, column: TableColumn<CommissionContributor>) {
        return column.property;
    }
}