import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
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
import { SelectDialogComponent } from "@shared/components/select-dialog/select-dialog.component";
import {Branch} from "@core/services/settings/branch/branch.interface";
import {BranchService} from "@core/services/settings/branch/branch.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {SelectFieldOptionsService} from "@core/services/pricing/field/select-field-options.service";
import {SelectFieldOptions} from "@core/services/pricing/field/select-field-options.interface";
import {SelectFieldOptionsFormComponent} from "../form/form.component";

@Component({
    selector: "app-constant-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class SelectFieldOptionsListComponent implements OnInit, AfterViewInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<SelectFieldOptions>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];
    branches: Branch[] = [];

    dataSource = new MatTableDataSource<SelectFieldOptions>([]); // Ajoute les données réelles ici

    constructor(
        private _selectFieldOptionsService: SelectFieldOptionsService,
        private _productService: ProductService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _branchService: BranchService,
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
    }

    data: SelectFieldOptions[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<SelectFieldOptions>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});

    ngOnInit(): void {
      // Initialiser les produits
      this._productService.getAll()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Product[]) => {
          this.products = data || [];
        });

      this._productService.products$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Product[]) => {
          this.products = data;
        });

      this._selectFieldOptionsService.getAll()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any) => {
          this.data = data?.content || [];
          this.dataSource.data = data?.content || [];
          console.log('SelectFieldOptionss loaded:', data);
        });

      this._selectFieldOptionsService.selectFieldOptionsList$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: SelectFieldOptions[]) => {
          this.data = data;
          this.dataSource.data = data;
        });

      this._managementEntityService.entity$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: ManagementEntity) => {
          this.managementEntity = data;
        });

      this._branchService.branches$.subscribe(branches => {
        this.branches = branches;
      });


      // Initialisation de la configuration de la table
      this.tableOptions = {
          title: '',
          columns: [
              // label: string;
              // description: string;
              // variableName: string;
              // toReturn: boolean;
              // managementEntityId: string;
              // productId: string;
              // branchId: string;
              // value: number;

              { label: 'entities.select-field-options.fields.label', property: 'label', type: 'text', visible: true },
              { label: 'entities.select-field-options.fields.name', property: 'name', type: 'text', visible: true },
              { label: 'entities.select-field-options.fields.description', property: 'description', type: 'text', visible: true },
              { label: 'entities.select-field-options.fields.possibilities', property: 'possibilities', type: 'text', visible: true },

          ],
          pageSize: 8,
          pageSizeOptions: [5, 6, 8],
          actions: [],
          renderItem: (element: SelectFieldOptions, property: keyof SelectFieldOptions) => {
              if ( property === 'possibilities') {
                    return element.possibilities.map(possibility => possibility.label).join(', ') || '--';
              }
              //   return element.branch ? element.branch.name : '--';
              return element[property] ?? '--';
          },
      };

      this._selectFieldOptionsService.selectFieldOptionsList$.subscribe({
          next: (data: SelectFieldOptions[]) => {
              this.data = data;
              this.dataSource.data = data;
          },
          error: (error) => {
              console.error('Error fetching constant data:', error);
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

  selectedBranch: Branch|undefined;

  openBranchSelection() {
    this._dialog.open(SelectDialogComponent, {
      width: '700px',
      data: {
        displayField: "name",
        items: this.branches,
        title: "branch-selection.title"
      }
    }).afterClosed().subscribe((branch: Branch) => {
      if (branch) {
        this.selectedBranch = branch;
        // Filtrer les produits par branche sélectionnée
        this._productService.getByBranchOrAll(branch.id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((products: Product[]) => {
            this.products = products || [];
            // Réinitialiser la sélection de produit si elle n'existe plus dans la nouvelle liste
            if (this.selectedProduct && !this.products.find(p => p.id === this.selectedProduct?.id)) {
              this.selectedProduct = undefined;
            }
          });
      }
    })
  }

  clearBranchSelection(): void {
    this.selectedBranch = undefined;
    this.selectedProduct = undefined;
    // Recharger tous les produits
    this._productService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((products: Product[]) => {
        this.products = products || [];
      });
  }

  products: Product[] = []
    searchCtrl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: Product|undefined;

    openSelection() {
        this._dialog.open(SelectDialogComponent, {
            width: '700px',
            data: {
                displayField: "name",
                items: this.products,
                title: "product-selection.title"
            }
        }).afterClosed().subscribe((product: Product) => {
            if (product) {
                this.selectedProduct = product;
                // Filtrer les constantes par produit sélectionné si nécessaire
                // this.dataSource.data = this.data.filter(constant => constant.productId === this.selectedProduct.id);
                this.dataSource.paginator = this.paginator;
                // this._changeDetectorRef.detectChanges();
            }
        })
    }

    onAdd(): void {

      if (!this.selectedBranch) {
        this._snackBar.open("entities.branch-selection.not-select-error-title", "close", { duration: 3000 });
        return;
      }

      if (!this.selectedProduct) {
        this._snackBar.open("entities.product-selection.not-select-error-title", "", { duration: 3000 });
        return;
      }

      this._dialog.open(SelectFieldOptionsFormComponent, {
          width: '600px',
          disableClose: true,
          data: {
              mode: 'create',
              product: this.selectedProduct?.id,
              branch: this.selectedBranch?.id
          }

      }).afterClosed().subscribe((result) => {
          if (result) {
              this._selectFieldOptionsService.getAll().subscribe();
          }
      });
    }



    onDelete(constant: SelectFieldOptions): void {
    }

    /**
        * Edit SelectFieldOptions
        */
    onEdit(constant: SelectFieldOptions): void {
        this._dialog.open(SelectFieldOptionsFormComponent, {
            width: '600px',
            disableClose: true,
            data: {
                mode: 'edit',
                ...constant
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                this._selectFieldOptionsService.getAll().subscribe();
            }
        });
    }


    onView(constant: SelectFieldOptions): void {
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
