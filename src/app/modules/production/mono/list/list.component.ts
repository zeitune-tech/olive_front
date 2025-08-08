import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PermissionsService } from "@core/permissions/permissions.service";
import { ManagementEntity } from "@core/services/administration/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/administration/management-entity/management-entity.service";
import { TaxCommissionsPointOfSale } from "@core/services/settings/commission-tax-point-ofsale/commission-tax-point-of-sale.interface";
import { TaxCommissionsPointOfSaleService } from "@core/services/settings/commission-tax-point-ofsale/commission-tax-point-of-sale.service";
import { Product } from "@core/services/settings/product/product.interface";
import { ProductService } from "@core/services/settings/product/product.service";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { ConfirmDeleteComponent } from "@shared/components/confirm-delete/confirm-delete.component";
import { SelectDialogComponent } from "@shared/components/select-dialog/select-dialog.component";
import { Subject, takeUntil } from "rxjs";
import { TaxCommissionFormComponent } from "src/app/modules/settings/commissions/tax-commission/form/form.component";

@Component(
    {
        selector: "production-list",
        templateUrl: "./list.component.html",
    }
)
export class ProductionListComponent implements OnInit {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<TaxCommissionsPointOfSale>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    dataSource = new MatTableDataSource<TaxCommissionsPointOfSale>([]); // Ajoute les données réelles ici

    constructor(
        private _taxCommissions: TaxCommissionsPointOfSaleService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _dialog: MatDialog
    ) {
     
    }


    data: TaxCommissionsPointOfSale[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<TaxCommissionsPointOfSale>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});




    ngOnInit(): void {
        // Initialisation de la configuration de la table
        this.tableOptions = {
            title: '',
            columns: [
                { property: "dateEffective", type: 'text', label: 'entities.tax-commission.fields.dateEffective', visible: true },
                { property: "pointOfSaleType", type: 'text', label: 'entities.tax-commission.fields.pointOfSaleType', visible: true },
                { property: "pointOfSale", type: 'text', label: 'entities.tax-commission.fields.pointOfSale', visible: true },
                { property: "rate", type: 'text', label: 'entities.tax-commission.fields.rate', visible: true },
                { property: "toWithhold", type: 'text', label: 'entities.tax-commission.fields.toWithhold', visible: true },
            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: TaxCommissionsPointOfSale, property: keyof TaxCommissionsPointOfSale) => {


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
        this._dialog.open(TaxCommissionFormComponent, {
            width: '600px',
            disableClose: true,
            data: {
                mode: 'create',
                commissionTaxPointOfSale: new TaxCommissionsPointOfSale({})
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                const index = this.dataSource.data.findIndex(item => item.id === result.id);
                if (index > -1) {
                    this.dataSource.data[index] = result;
                    this.dataSource._updateChangeSubscription();
                } else {
                    this.dataSource.data.push(result);
                    this.dataSource._updateChangeSubscription();
                }
            }
        });
    }

    onDelete(product: TaxCommissionsPointOfSale): void {
        this._dialog.open(ConfirmDeleteComponent, {
            data: product,
            width: '600px',
            disableClose: true,
        }).afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    /**
        * Edit TaxCommissionsPointOfSale TaxCommissionsPointOfSale
        */
    onEdit(taxCom: TaxCommissionsPointOfSale): void {
        this._dialog.open(TaxCommissionFormComponent, {
            data: {
                mode: 'edit',
                commissionTaxPointOfSale: taxCom
            },
            width: '600px',
            disableClose: true,
        }).afterClosed().subscribe((result) => {
            if (result) {
                const index = this.dataSource.data.findIndex(item => item.id === result.id);
                if (index > -1) {
                    this.dataSource.data[index] = result;
                    this.dataSource._updateChangeSubscription();
                }
            }
        })
    }



    onView(product: TaxCommissionsPointOfSale): void {
        //this._router.navigate(['/administration/products/list']);
    }

    onButtonClick(product: TaxCommissionsPointOfSale, column: string): void {
        
    }

    hasPermission(product: TaxCommissionsPointOfSale): boolean {
        return false;
    }


    trackByProperty(index: number, column: TableColumn<TaxCommissionsPointOfSale>) {
        return column.property;
    }
}