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
import { ConfirmDeleteComponent } from "@shared/components/confirm-delete/confirm-delete.component";
import { Formula } from "@core/services/pricing/formula/formula.interface";
import { FormulaService } from "@core/services/pricing/formula/formula.service";

@Component({
    selector: "app-constant-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class FormulaListComponent implements OnInit, AfterViewInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<Formula>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];
    branches: Branch[] = [];

    dataSource = new MatTableDataSource<Formula>([]); // Ajoute les données réelles ici

    constructor(
        private _formulaService: FormulaService,
        private _productService: ProductService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _branchService: BranchService,
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
    }

    data: Formula[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<Formula>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    managementEntity: ManagementEntity = new ManagementEntity({});

    ngOnInit(): void {
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

      this._formulaService.getAll()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe();

      this._managementEntityService.entity$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: ManagementEntity) => {
          this.managementEntity = data;
        });

      this._branchService.branches$.subscribe(branches => {
        this.branches = branches;
      });

      // Configuration du contrôle de recherche
      this.searchCtrl.valueChanges
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(value => {
          this.applyFilter(value);
        });

      // Charger les données des constantes
      this._formulaService.formulas$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Formula[]) => {
          this.data = data;
          this.dataSource.data = data;
          // Appliquer le filtre actuel après le chargement des données
          if (this.searchCtrl.value) {
            this.applyFilter(this.searchCtrl.value);
          }
        });

      // Initialisation de la configuration de la table
      this.tableOptions = {
          title: '',
          columns: [
            { label: 'entities.constant.fields.label', property: 'label', type: 'text', visible: true },
            { label: 'entities.constant.fields.description', property: 'description', type: 'text', visible: true },
            { label: 'entities.constant.fields.variableName', property: 'variableName', type: 'text', visible: true },
            { label: 'entities.constant.fields.toReturn', property: 'toReturn', type: 'text', visible: true },
            { label: 'entities.constant.fields.branch', property: 'branch', type: 'text', visible: true },
            { label: 'entities.constant.fields.product', property: 'product', type: 'text', visible: true },
          ],
          pageSize: 8,
          pageSizeOptions: [5, 6, 8],
          actions: [],
          renderItem: (element: Formula, property: keyof Formula) => {
            if (property === 'toReturn') {
                return element.toReturn ? 'Oui' : 'Non';
            }
            if (property === 'branch') {
                  return this.branches.find(b => b.id === element.branch)?.name ?? '--';
            }
            if (property === 'product') {
                return this.products.find(p => p.id === element.product)?.name ?? '--';
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

            // Configuration du filtre personnalisé
            this.dataSource.filterPredicate = (data: Formula, filter: string) => {
                const searchText = filter.toLowerCase();

                // Recherche dans les propriétés de base
                const basicSearch = (
                    (data.label?.toLowerCase() || '').includes(searchText) ||
                    (data.description?.toLowerCase() || '').includes(searchText) ||
                    (data.variableName?.toLowerCase() || '').includes(searchText)
                );

                // Recherche dans le nom de la branche
                const branchName = this.branches.find(b => b.id === data.branch)?.name?.toLowerCase() || '';
                const branchSearch = branchName.includes(searchText);

                // Recherche dans le nom du produit
                const productName = this.products.find(p => p.id === data.product)?.name?.toLowerCase() || '';
                const productSearch = productName.includes(searchText);

                // Recherche dans la valeur booléenne toReturn
                const toReturnText = data.toReturn ? 'oui' : 'non';
                const toReturnSearch = toReturnText.includes(searchText);

                return basicSearch || branchSearch || productSearch || toReturnSearch;
            };
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Applique un filtre de recherche sur les données du tableau
     */
    applyFilter(filterValue: string): void {
        filterValue = filterValue.trim().toLowerCase();
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /**
     * Efface le filtre de recherche
     */
    clearFilter(): void {
        this.searchCtrl.setValue('');
        this.dataSource.filter = '';
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
        // Recharger les constantes pour la branche sélectionnée
        this._formulaService.formulas$.subscribe({
          next: (data: Formula[]) => {
            this.data = data;
            this.dataSource.data = data;
            // Réappliquer le filtre après le chargement des données
            if (this.searchCtrl.value) {
              this.applyFilter(this.searchCtrl.value);
            }
          },
          error: (error) => {
            console.error('Error fetching constant data:', error);
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
        // Réappliquer le filtre après le chargement des produits
        if (this.searchCtrl.value) {
          this.applyFilter(this.searchCtrl.value);
        }
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
              this.dataSource.paginator = this.paginator;

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

    // this._dialog.open(FormulaFormComponent, {
    //     width: '600px',
    //     disableClose: true,
    //     data: {
    //         mode: 'create',
    //         product: this.selectedProduct?.id,
    //         branch: this.selectedBranch?.id
    //     }
    //
    // }).afterClosed().subscribe((result) => {
    //     if (result) {
    //         this._formulaService.getAll().subscribe(() => {
    //             // Réappliquer le filtre après le rechargement des données
    //             if (this.searchCtrl.value) {
    //                 this.applyFilter(this.searchCtrl.value);
    //             }
    //         });
    //     }
    // });
  }

  onDelete(constant: Formula): void {
    this._dialog.open(ConfirmDeleteComponent, {
        width: '400px',
        data: {
            title: 'entities.constant.delete.title',
            message: 'entities.constant.delete.message',
            confirmButtonText: 'actions.delete',
            cancelButtonText: 'actions.cancel'
        }
    }).afterClosed().subscribe((confirmed) => {
        if (confirmed) {
            this._formulaService.delete(constant.id).subscribe({
                next: () => {
                    this._snackBar.open('entities.constant.delete.success', '', { duration: 3000, panelClass: 'snackbar-success' });
                    this._formulaService.getAll().subscribe(() => {
                        // Réappliquer le filtre après le rechargement des données
                        if (this.searchCtrl.value) {
                            this.applyFilter(this.searchCtrl.value);
                        }
                    });
                },
                error: () => {
                    this._snackBar.open('entities.constant.delete.error', '', { duration: 3000, panelClass: 'snackbar-error' });
                }
            });
        }
    });

  }

  /**
  * Edit Formula
  */
  onEdit(constant: Formula): void {
      // this._dialog.open(FormulaFormComponent, {
      //     width: '600px',
      //     disableClose: true,
      //     data: {
      //         mode: 'edit',
      //         ...constant
      //     }
      // }).afterClosed().subscribe((result) => {
      //     if (result) {
      //         this._formulaService.getAll().subscribe(() => {
      //             // Réappliquer le filtre après le rechargement des données
      //             if (this.searchCtrl.value) {
      //                 this.applyFilter(this.searchCtrl.value);
      //             }
      //         });
      //     }
      // });
  }


  onView(constant: Formula): void {
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


  trackByProperty(index: number, column: TableColumn<Formula>) {
      return column.property;
  }
}
