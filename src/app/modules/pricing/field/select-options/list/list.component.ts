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
import { SelectDialogComponent } from "@shared/components/select-dialog/select-dialog.component";
import { SelectFieldOptions } from "@core/services/pricing/field/select-field-options.interface";
import { SelectFieldOptionValue } from "@core/services/pricing/field/select-field-option-value.interface";
import { SelectFieldOptionsService } from "@core/services/pricing/field/select-field-options.service";
import {Component, OnInit, ViewChild} from "@angular/core";
import {SelectionModel} from "@angular/cdk/collections";
import { UntypedFormControl } from "@angular/forms";

@Component({
    selector: "app-select-field-options-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class SelectFieldOptionsListComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<SelectFieldOptions>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    dataSource = new MatTableDataSource<SelectFieldOptions>([]); // Ajoute les données réelles ici

    constructor(
        private _selectFieldOptionsService: SelectFieldOptionsService,
        private _productService: ProductService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _dialog: MatDialog
    ) {
    }

    data: SelectFieldOptions[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<SelectFieldOptions>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});

    ngOnInit(): void {
      // Charger les données des options de champs
      this._selectFieldOptionsService.getAll().subscribe();

      // Abonnement aux données du service
      this._selectFieldOptionsService.selectFieldOptionsList$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: SelectFieldOptions[]) => {
          this.data = data;
          this.dataSource.data = data;
      });

      // Abonnement aux données de l'entité de gestion
      this._managementEntityService.entity$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: ManagementEntity) => {
          this.managementEntity = data;
        });

        // Initialisation de la configuration de la table
        this.tableOptions = {
            title: 'entities.select-field-options.table.title',
            columns: [
                { property: 'label', type: 'text', label: 'entities.select-field-options.fields.label', visible: true },
                { property: 'name', type: 'text', label: 'entities.select-field-options.fields.name', visible: true },
                { property: 'description', type: 'text', label: 'entities.select-field-options.fields.description', visible: true },
                {
                    property: 'possibilities',
                    type: 'text',
                    label: 'entities.select-field-options.fields.possibilities',
                    visible: true,
                }
            ],
            pageSize: 8,
            pageSizeOptions: [5, 6, 8],
            actions: [],
            renderItem: (element: SelectFieldOptions, property: keyof SelectFieldOptions) => {
                if (property === 'possibilities') {
                    return element.possibilities.map(possibility => `${possibility.label} (${possibility.name})`).join(', ');
                }
                return element[property] ?? '--';
            },
        };

        this._selectFieldOptionsService.selectFieldOptionsList$.subscribe({
            next: (data: SelectFieldOptions[]) => {
                this.data = data;
                this.dataSource.data = data;
            },
            error: (error) => {
                console.error('Error fetching field data:', error);
            }
        });

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
        this._dialog.open(SelectDialogComponent, {
            width: '600px',
            disableClose: true,
        }).afterClosed().subscribe((result) => {
            if (result) {
                this._productService.getAll().subscribe();
            }
        });
    }

    onDelete(product: Product): void {
        this._dialog.open(SelectDialogComponent, {
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
    onEdit(selectFiedOptions: SelectFieldOptions): void {
        console.log("Editing select field options:", selectFiedOptions);

    }


    onView(product: Product): void {
        //this._router.navigate(['/administration/products/list']);
    }

    onButtonClick(product: Product, column: string): void {
        if (column === 'productionRegistry') {
            alert('Production Registry button clicked for product: ' + product.name);
        }
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


    trackByProperty(index: number, column: TableColumn<SelectFieldOptions>) {
        return column.property;
    }
}
