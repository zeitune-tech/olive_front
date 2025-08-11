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
import {SelectFieldOptionValueService} from "@core/services/pricing/field/select-field-option-value/select-field-option-value.service";
import {SelectFieldOptionValue} from "@core/services/pricing/field/select-field-option-value/select-field-option-value.interface";
import {SelectFieldOptionValueFormComponent} from "../form/form.component";
import { ConfirmDeleteComponent } from "@shared/components/confirm-delete/confirm-delete.component";
import { TranslocoService } from "@jsverse/transloco";

@Component({
    selector: "app-constant-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class SelectFieldOptionValueListComponent implements OnInit, AfterViewInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<SelectFieldOptionValue>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];
    branches: Branch[] = [];

    dataSource = new MatTableDataSource<SelectFieldOptionValue>([]); // Ajoute les données réelles ici

    constructor(
        private _selectFieldOptionValueService: SelectFieldOptionValueService,
        private _productService: ProductService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _branchService: BranchService,
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _translocoService: TranslocoService,
    ) {
    }

    data: SelectFieldOptionValue[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<SelectFieldOptionValue>(true, []);
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

      this._selectFieldOptionValueService.getAll()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any) => {
          this.data = data?.content || [];
          this.dataSource.data = data?.content || [];
          console.log('SelectFieldOptionValues loaded:', data);
        });

      this._selectFieldOptionValueService.selectFieldOptionValues$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: SelectFieldOptionValue[]) => {
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
              { label: 'entities.select-field-options.fields.label', property: 'label', type: 'text', visible: true },
              { label: 'entities.select-field-options.fields.name', property: 'name', type: 'text', visible: true },
              { label: 'entities.select-field-options.fields.group', property: 'group', type: 'text', visible: true },
          ],
          pageSize: 8,
          pageSizeOptions: [5, 6, 8],
          actions: [],
          renderItem: (element: SelectFieldOptionValue, property: keyof SelectFieldOptionValue) => {
              return element[property] ?? '--';
          },
      };

      this._selectFieldOptionValueService.selectFieldOptionValues$.subscribe({
          next: (data: SelectFieldOptionValue[]) => {
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
        this._snackBar.open(
          this._translocoService.translate("entities.branch-selection.not-select-error-title"), 
          "", 
          { duration: 3000 }
        );
        return;
      }

      if (!this.selectedProduct) {
        this._snackBar.open(
          this._translocoService.translate("entities.product-selection.not-select-error-title"), 
          "", 
          { duration: 3000 }
        );
        return;
      }

      this._dialog.open(SelectFieldOptionValueFormComponent, {
          width: '600px',
          disableClose: true,
          data: {
              mode: 'create',
              product: this.selectedProduct?.id,
              branch: this.selectedBranch?.id
          }

      }).afterClosed().subscribe((result) => {
          if (result) {
              this._selectFieldOptionValueService.getAll().subscribe();
          }
      });
    }

    /**
    * Edit SelectFieldOptionValue
    */
    onEdit(constant: SelectFieldOptionValue): void {
        this._dialog.open(SelectFieldOptionValueFormComponent, {
            width: '600px',
            disableClose: true,
            data: {
                mode: 'edit',
                ...constant
            }
        }).afterClosed().subscribe((result) => {
            if (result) {
                this._selectFieldOptionValueService.getAll().subscribe();
            }
        });
    }

    /**
     * Delete SelectFieldOptionValue
     */
    onDelete(constant: SelectFieldOptionValue): void {
      this._dialog.open(ConfirmDeleteComponent, {
          data: {
              title: 'entities.select-field-option-value.delete.title',
              message: 'entities.select-field-option-value.delete.message',
              confirmButtonText: 'form.actions.delete',
              cancelButtonText: 'form.actions.cancel'
          }
      }).afterClosed().subscribe((confirmed) => {
          if (confirmed) {
              this._selectFieldOptionValueService.delete(constant.id).subscribe({
                  next: () => {
                      this._snackBar.open(
                          this._translocoService.translate('entities.select-field-option-value.delete.success'),
                          '',
                          { duration: 3000, panelClass: 'snackbar-success' }
                      );
                      this._selectFieldOptionValueService.getAll().subscribe();
                  },
                  error: () => {
                      this._snackBar.open(
                          this._translocoService.translate('entities.select-field-option-value.delete.error'),
                          '',
                          { duration: 3000, panelClass: 'snackbar-error' }
                      );
                  }
              });
          }
      });
    }

    onView(constant: SelectFieldOptionValue): void {
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


    trackByProperty(index: number, column: TableColumn<SelectFieldOptionValue>) {
        return column.property;
    }
}
