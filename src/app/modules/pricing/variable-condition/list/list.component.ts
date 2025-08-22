import {SelectionModel} from "@angular/cdk/collections";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {UntypedFormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {PermissionsService} from "@core/permissions/permissions.service";
import {ManagementEntityService} from "@core/services/administration/management-entity/management-entity.service";
import {Product} from "@core/services/settings/product/product.interface";
import {ProductService} from "@core/services/settings/product/product.service";
import {animations} from "@lhacksrt/animations";
import {TableColumn, TableOptions} from "@lhacksrt/components/table/table.interface";
import {Subject, takeUntil} from "rxjs";
import {Branch} from "@core/services/settings/branch/branch.interface";
import {BranchService} from "@core/services/settings/branch/branch.service";
import {VariableConditionFormComponent} from "../form/form.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {VariableCondition} from "@core/services/pricing/variable-condition/variable-condition.model";
import {VariableConditionService} from "@core/services/pricing/variable-condition/variable-condition.service";
import {ConfirmDeleteComponent} from "@shared/components/confirm-delete/confirm-delete.component";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";
import {SelectionService} from "../../shared/services/selection.service";
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";

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

  dataSource = new MatTableDataSource<VariableCondition>([]); // Ajoute les données réelles ici
  data: VariableCondition[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<VariableCondition>(true, []);
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  doResolve() {
    this._variableConditionService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  setupSelectionService() {
    // S'abonner aux changements de sélection
    this._selectionService.selectedBranch$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(branch => {
        this.selectedBranch = branch;
      });
    this._selectionService.selectedProduct$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(product => {
        this.selectedProduct = product;
        if (product) {
          this._coverageService.getByProduct(product.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((coverages: Coverage[]) => {
              this.coverages = coverages || [];
            });
          this.filterPricingTypes()
        }
      });
    this._selectionService.selectedPricingType$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(pricingType => {
        this.selectedPricingType = pricingType;
        this.filterPricingTypes()
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
    this.doResolve();
    this._variableConditionService.variableConditions$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((variableConditions: VariableCondition[]) => {
        this.dataSource.data = variableConditions;
        this.data = variableConditions;
        this.filterPricingTypes();
      });
    // Mise en place de la selection
    this.setupSelectionService();
    // Initialisation de la configuration de la table
    this.tableOptions = {
      title: '',
      columns: [
        {label: 'entities.variable-condition.fields.label', property: 'label', type: 'text', visible: true},
        {label: 'entities.variable-condition.fields.description', property: 'description', type: 'text', visible: true},
        // {
        //   label: 'entities.variable-condition.fields.variableName',
        //   property: 'variableName',
        //   type: 'text',
        //   visible: true
        // },
        {label: 'entities.variable-condition.fields.toReturn', property: 'toReturn', type: 'text', visible: true},
        {label: 'entities.variable-condition.fields.coverage', property: 'coverage', type: 'text', visible: true},
      ],
      pageSize: 8,
      pageSizeOptions: [5, 6, 8],
      actions: [],
      renderItem: (element: VariableCondition, property: keyof VariableCondition) => {
        if (property == "toReturn") {
          return element.toReturn ? 'Oui' : 'Non';
        }
        if (property === 'coverage')
          return this.coverages.find(c => c.id === element.coverage)?.reference.designation ?? '--';
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

  filterPricingTypes(): void {
    // Si aucune sélection n'est faite, on affiche un tableau vide
    if (!this.selectedBranch || !this.selectedProduct) {
      this.dataSource.data = [];
      return;
    }

    if (this.data) {
      let filteredData = [...this.data];
      // Appliquer les filtres pour branch et product
      filteredData = filteredData.filter(pt =>
        pt.branch === this.selectedBranch?.id &&
        pt.product === this.selectedProduct?.id &&
        pt.pricingType === this.selectedPricingType?.id
      );
      this.dataSource.data = filteredData;
      if (this.searchCtrl.value) {
        this.applyFilter(this.searchCtrl.value);
      }
    }
  }


  constructor(
    private _variableConditionService: VariableConditionService,
    private _permissionService: PermissionsService,
    private _branchService: BranchService,
    private _productService: ProductService,
    private _coverageService: CoverageService,
    private _selectionService: SelectionService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
  }

  branches: Branch[] = [];
  selectedBranch: Branch | undefined;

  products: Product[] = []
  selectedProduct: Product | undefined;

  coverages: Coverage[] = []
  selectedPricingType: PricingType | undefined;

  doIfHasAllSelections(
    action: () => void
  ): any {
    const hasAllSelections = this._selectionService.hasAllSelections(['branch', 'product', 'pricingType']);
    if (!hasAllSelections.value) {
      switch (hasAllSelections.missing[0]) {
        case 'branch':
          this._snackBar.open("entities.selection.branch.incomplete", "close", {duration: 3000});
          break;
        case 'product':
          this._snackBar.open("entities.selection.product.incomplete", "close", {duration: 3000});
          break;
        case 'pricingType':
          this._snackBar.open("entities.selection.pricingType.incomplete", "close", {duration: 3000});
          break;
      }
      return;
    }
    action();
  }

  onAdd(): void {
    this.doIfHasAllSelections(() => {
      this._dialog.open(VariableConditionFormComponent, {
        width: '800px',
        disableClose: true,
        data: {
          mode: 'create',
          product: this.selectedProduct!.id,
          branch: this.selectedBranch!.id,
          pricingType: this.selectedPricingType!.id
        }

      }).afterClosed().subscribe((result) => {
        if (result) {
          this._variableConditionService.getAll().subscribe();
        }
      });
    });
  }

  onDelete(VariableCondition: VariableCondition): void {
    this._dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        title: 'entities.variable-condition.delete.title',
        message: 'entities.variable-condition.delete.message',
        confirmButtonText: 'actions.delete',
        cancelButtonText: 'actions.cancel'
      }
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._variableConditionService.delete(VariableCondition.id).subscribe({
          next: () => {
            this._snackBar.open('entities.variable-condition.delete.success', '', {
              duration: 3000,
              panelClass: 'snackbar-success'
            });
            this._variableConditionService.getAll().subscribe(() => {
              // Réappliquer le filtre après le rechargement des données
              if (this.searchCtrl.value) {
                //this.applyFilter(this.searchCtrl.value);
              }
            });
          },
          error: () => {
            this._snackBar.open('entities.variable-condition.delete.error', '', {duration: 3000, panelClass: 'snackbar-error'});
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
        this._variableConditionService.getAll().subscribe();
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

  // hasPermission(product: Product): boolean {
  //     let hasPerm = this._permissionService.hasPermission(PERMISSIONS.UPDATE_PRODUCTS);
  //     if (!hasPerm) {
  //         return false;
  //     } else if (this.managementEntity.type === "MARKET_LEVEL_ORGANIZATION") {
  //         return true;
  //     } else if (this.managementEntity.type === "COMPANY" && product.visibility === "PRIVATE") {
  //         return true;
  //     } else
  //         return false;
  // }

  trackByProperty(index: number, column: TableColumn<VariableCondition>) {
    return column.property;
  }
}
