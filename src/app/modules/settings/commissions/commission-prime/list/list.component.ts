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
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { TranslocoService } from "@jsverse/transloco";
import { CommissionPrimeFormComponent } from "../form/form.component";
import { CommissionPointOfSale } from "@core/services/settings/commission-point-of-sale/commission-point-of-sale.interface";
import { CommissionPointOfSaleService } from "@core/services/settings/commission-point-of-sale/commission-point-of-sale.service";
import { Product } from "@core/services/settings/product/product.interface";
import { SelectDialogComponent } from "@shared/components/select-dialog/select-dialog.component";
import { ProductService } from "@core/services/settings/product/product.service";

@Component({
    selector: "app-products-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class CommissionPrimeListComponent implements OnInit {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<CommissionPointOfSale>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    dataSource = new MatTableDataSource<CommissionPointOfSale>([]); // Ajoute les données réelles ici

    products: Product[] = [];
    selectedProduct: Product = new Product({});

    constructor(
        private _commissionService: CommissionPointOfSaleService,
        private _productService: ProductService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _tanslateService: TranslocoService,
        private _router: Router,
        private _dialog: MatDialog
    ) {
        this._commissionService.commissionsPointsOfSalePrimes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: CommissionPointOfSale[]) => {
                this.data = data;
                this.dataSource.data = data;
            });

        this._managementEntityService.entity$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: ManagementEntity) => {
                this.managementEntity = data;
            });
    }


    data: CommissionPointOfSale[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<CommissionPointOfSale>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});


    ngOnInit(): void {
        // Initialisation de la configuration de la table
        this.tableOptions = {
            title: '',
            columns: [
                { property: 'coverage', type: 'text', label: 'entities.commission.fields.coverage', visible: true },
                { property: 'typePointOfSale', type: 'text', label: 'entities.commission.fields.typePointOfSale', visible: true },
                { property: 'pointOfSale', type: 'text', label: 'entities.commission.fields.pointOfSale', visible: true },
                { property: 'managementRate', type: 'text', label: 'entities.commission.fields.managementRate', visible: true },
                { property: 'contributionRate', type: 'text', label: 'entities.commission.fields.contributionRate', visible: true },
                { property: 'dateEffective', type: 'text', label: 'entities.commission.fields.dateEffective', visible: true },
            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: CommissionPointOfSale, property: keyof CommissionPointOfSale) => {



                if (property === 'coverage') {
                    return element.coverage?.reference?.designation || '--';
                } 

                if (property === 'typePointOfSale') {
                    return this._tanslateService.translate(`entities.commission.options.typePointOfSale.${element.typePointOfSale}`);
                }

                if (property === 'pointOfSale') {
                    return element.pointOfSale?.name ?? '--';
                }

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

    searchCtrl: UntypedFormControl = new UntypedFormControl();

    openSelection() {
        this._dialog.open(SelectDialogComponent, {
            width: '700px',
            data: {
                items: this.products,
            }
        }).afterClosed().subscribe((product: Product) => {
            if (product) {
                this.selectedProduct = product;
                this.dataSource.data = this.data.filter(coverage => coverage.product.id === this.selectedProduct.id);
                this.dataSource.paginator = this.paginator;
                // this._changeDetectorRef.detectChanges();
            }
        })
    }
    onAdd() {
        this._dialog.open(CommissionPrimeFormComponent, {
            width: '600px',
            disableClose: true,
            data: {
                mode: 'create',
                commissionPointOfSale: {} as CommissionPointOfSale
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                this.dataSource.data.push(result);
                this.dataSource._updateChangeSubscription();
            }
        });
    }

    /**
        * Edit CommissionPointOfSale CommissionPointOfSale
        */
    onEdit(product: CommissionPointOfSale): void {
        this._dialog.open(CommissionPrimeFormComponent, {
            data: product,
            width: '600px',
            disableClose: true,
        }).afterClosed().subscribe((result) => {
            if (result) {
                const index = this.dataSource.data.findIndex(item => item.id === result.id);
                if (index !== -1) {
                    this.dataSource.data[index] = result;
                    this.dataSource._updateChangeSubscription();
                }
            }
        })
    }

    onDelete(product: CommissionPointOfSale): void {
        this._commissionService.delete(product.id).subscribe({
            next: () => {
                this._tanslateService.translate('form.success.delete');
                this._commissionService.getAll().subscribe();
            },
            error: () => {
                this._tanslateService.translate('form.errors.submission');
            }
        });
    }


    onView(product: CommissionPointOfSale): void {
        //this._router.navigate(['/administration/products/list']);
    }

    onButtonClick(product: CommissionPointOfSale, column: string): void {

    }

    hasPermission(product: CommissionPointOfSale): boolean {
        return false;
    }


    trackByProperty(index: number, column: TableColumn<CommissionPointOfSale>) {
        return column.property;
    }
}