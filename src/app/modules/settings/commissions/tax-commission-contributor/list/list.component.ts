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
import { TaxCommissionContributorFormComponent } from "../form/form.component";
import { SelectDialogComponent } from "@shared/components/select-dialog/select-dialog.component";
import { TaxCommissionsContributor } from "@core/services/settings/commission-tax-contributor/commission-tax-contributor.interface";
import { TaxCommissionsContributorService } from "@core/services/settings/commission-tax-contributor/commission-tax-contributor.service";
import { Product } from "@core/services/settings/product/product.interface";

@Component({
    selector: "app-tax-commissions-contributor-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class TaxCommissionsContributorListComponent implements OnInit {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<TaxCommissionsContributor>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    dataSource = new MatTableDataSource<TaxCommissionsContributor>([]); // Ajoute les données réelles ici

    constructor(
        private _productService: TaxCommissionsContributorService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _dialog: MatDialog
    ) {
        this._productService.commissionTaxes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: TaxCommissionsContributor[]) => {
                this.data = data;
                this.dataSource.data = data;
            });

        this._managementEntityService.entity$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: ManagementEntity) => {
                this.managementEntity = data;
            });
    }


    data: TaxCommissionsContributor[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<TaxCommissionsContributor>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});

    ngOnInit(): void {
        // Initialisation de la configuration de la table
        this.tableOptions = {
            title: '',
            columns: [
                { property: "dateEffective", type: 'text', label: 'entities.tax-commission.table.dateEffective', visible: true },
                { property: "contributor", type: 'text', label: 'entities.tax-commission.table.contributor', visible: true },
                { property: "contributorType", type: 'text', label: 'entities.tax-commission.table.contributorType', visible: true },
                { property: "rate", type: 'text', label: 'entities.tax-commission.table.rate', visible: true },
                { property: "toWithhold", type: 'text', label: 'entities.tax-commission.table.toWithhold', visible: true },
            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: TaxCommissionsContributor, property: keyof TaxCommissionsContributor) => {


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
        this._dialog.open(TaxCommissionContributorFormComponent, {
            width: '600px',
            disableClose: true,
        }).afterClosed().subscribe((result) => {
            if (result) {
                this._productService.getAll().subscribe();
            }
        });
    }

    onDelete(product: TaxCommissionsContributor): void {
        this._dialog.open(TaxCommissionContributorFormComponent, {
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
        * Edit TaxCommissionsContributor TaxCommissionsContributor
        */
    onEdit(product: TaxCommissionsContributor): void {
        this._dialog.open(TaxCommissionContributorFormComponent, {
            data: product,
            width: '600px',
            disableClose: true,
        }).afterClosed().subscribe((result) => {
            if (result) {
                this._productService.getAll().subscribe();
            }
        })
    }



    onView(product: TaxCommissionsContributor): void {
        //this._router.navigate(['/administration/commissionTaxes/list']);
    }

    onButtonClick(product: TaxCommissionsContributor, column: string): void {
        // if (column === 'productionRegistry') {
        //     alert('TaxCommissionsContributorion Registry button clicked for product: ' + product.name);
        // }
    }

    hasPermission(product: TaxCommissionsContributor): boolean {
        return true;
    }


    trackByProperty(index: number, column: TableColumn<TaxCommissionsContributor>) {
        return column.property;
    }
}