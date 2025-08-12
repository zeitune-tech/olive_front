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
import { VariableConditionFormComponent } from "../form/form.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VariableCondition } from "@core/services/pricing/variable-condition/variable-condition.interface";
import { VariableConditionService } from "@core/services/pricing/variable-condition/variable-condition.service";
import {ConfirmDeleteComponent} from "@shared/components/confirm-delete/confirm-delete.component";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";

@Component({
    selector: "app-variable-condition-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class VariableConditionListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  tableOptions!: TableOptions<VariableCondition>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  // Pour les mat-header-row
  groupHeader: string[] = [];
  subHeader: string[] = [];
  visibleColumns: string[] = [];
  branches: Branch[] = [];

  dataSource = new MatTableDataSource<VariableCondition>([]); // Ajoute les données réelles ici

  constructor(
      private _VariableConditionService: VariableConditionService,
      private _permissionService: PermissionsService,
      private _managementEntityService: ManagementEntityService,
      private _branchService: BranchService,
      private _productService: ProductService,
      private _coverageService: CoverageService,
      private _dialog: MatDialog,
      private _snackBar: MatSnackBar
  ) {
  }

  data: VariableCondition[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<VariableCondition>(true, []);
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  managementEntity: ManagementEntity = new ManagementEntity({});

  loadValues() {
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

    this._VariableConditionService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.data = data?.content || [];
        this.dataSource.data = data?.content || [];
        console.log('VariableConditions loaded:', data);
      });

    this._VariableConditionService.variableConditions$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: VariableCondition[]) => {
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

  ngOnInit(): void {
    this.loadValues();
    // Initialisation de la configuration de la table
    this.tableOptions = {
        title: '',
        columns: [
            { label: 'entities.variable-condition.fields.label', property: 'label', type: 'text', visible: true },
            { label: 'entities.variable-condition.fields.description', property: 'description', type: 'text', visible: true },
            { label: 'entities.variable-condition.fields.variableName', property: 'variableName', type: 'text', visible: true },
            { label: 'entities.variable-condition.fields.toReturn', property: 'toReturn', type: 'text', visible: true },
            { label: 'entities.variable-condition.fields.branch', property: 'branch', type: 'text', visible: true },
            { label: 'entities.variable-condition.fields.product', property: 'product', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
        ],
        renderItem: (element: VariableCondition, property: keyof VariableCondition) => {
            if (property === 'toReturn') {
                return element.toReturn ? 'Oui' : 'Non';
            }
            if (property === 'branch') {
                return this.branches.find(b => b.id === element.branch)?.name ?? '--';
            }
            if (property === 'product') {
                return this.products.find(p => p.id === element.product)?.name ?? '--';
            }
            //   return element.branch ? element.branch.name : '--';
            return element[property] ?? '--';
        },
    };
    // Construction des lignes d’en-tête
    this.buildHeaderRows();
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


  products: Product[] = []
  selectedProduct: Product|undefined;
  openProductSelection() {
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
              // Recuperer les couvertures associées au produit sélectionné
              this._coverageService.getByProduct(product.id)
                  .pipe(takeUntil(this._unsubscribeAll))
                  .subscribe((coverages: Coverage[]) => {
                      this.coverages = coverages || [];
                      // Réinitialiser la sélection de couverture si elle n'existe plus dans la nouvelle liste
                      if (this.selectedCoverage && !this.coverages.find(c => c.id === this.selectedCoverage?.id)) {
                          this.selectedCoverage = undefined;
                      }
                  });
          }
      })
  }

  coverages: Coverage[] = []
  selectedCoverage: Coverage|undefined;
  openCoverageSelection() {
    console.log(this.coverages)
    this._dialog.open(SelectDialogComponent, {
      width: '700px',
      data: {
        displayField: "nature",
        items: this.coverages,
        title: "coverage-selection.title"
      }
    }).afterClosed().subscribe((coverage: Coverage) => {
      if (coverage) {
        this.selectedCoverage = coverage;
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

      this._dialog.open(VariableConditionFormComponent, {
          width: '800px',
          disableClose: true,
          data: {
              mode: 'create',
              product: this.selectedProduct?.id,
              branch: this.selectedBranch?.id,
          }

      }).afterClosed().subscribe((result) => {
          if (result) {
              this._VariableConditionService.getAll().subscribe();
          }
      });
  }

  onDelete(VariableCondition: VariableCondition): void {
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
        this._VariableConditionService.delete(VariableCondition.id).subscribe({
          next: () => {
            this._snackBar.open('entities.constant.delete.success', '', { duration: 3000, panelClass: 'snackbar-success' });
            this._VariableConditionService.getAll().subscribe(() => {
              // Réappliquer le filtre après le rechargement des données
              if (this.searchCtrl.value) {
                //this.applyFilter(this.searchCtrl.value);
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
   * Edit VariableCondition
   */
  onEdit(VariableCondition: VariableCondition): void {
      this._dialog.open(VariableConditionFormComponent, {
          width: '800px',
          disableClose: true,
          data: {
              mode: 'edit',
              ...VariableCondition
          }
      }).afterClosed().subscribe((result) => {
          if (result) {
              this._VariableConditionService.getAll().subscribe();
          }
      });
  }

  onView(variableCondition: VariableCondition): void {
      // Ouvrir le formulaire en mode lecture seule pour voir les détails
      this._dialog.open(VariableConditionFormComponent, {
          width: '800px',
          disableClose: false,
          data: {
              mode: 'view',
              ...variableCondition
          }
      });
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

  trackByProperty(index: number, column: TableColumn<VariableCondition>) {
      return column.property;
  }
}
