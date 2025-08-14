import {SelectionModel} from "@angular/cdk/collections";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {UntypedFormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {PERMISSIONS} from "@core/permissions/permissions.data";
import {PermissionsService} from "@core/permissions/permissions.service";
import {ManagementEntity} from "@core/services/administration/management-entity/management-entity.interface";
import {ManagementEntityService} from "@core/services/administration/management-entity/management-entity.service";
import {Product} from "@core/services/settings/product/product.interface";
import {ProductService} from "@core/services/settings/product/product.service";
import {animations} from "@lhacksrt/animations";
import {TableOptions, TableColumn} from "@lhacksrt/components/table/table.interface";
import {Subject, takeUntil} from "rxjs";
import {SelectDialogComponent} from "@shared/components/select-dialog/select-dialog.component";
import {Constant} from "@core/services/pricing/constant/constant.interface";
import {ConstantService} from "@core/services/pricing/constant/constant.service";
import {Branch} from "@core/services/settings/branch/branch.interface";
import {BranchService} from "@core/services/settings/branch/branch.service";
import {ConstantFormComponent} from "../form/form.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDeleteComponent} from "@shared/components/confirm-delete/confirm-delete.component";
import {SelectionService} from "../../shared/services/selection.service";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import {VariableCondition} from "@core/services/pricing/variable-condition/variable-condition.interface";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";

@Component({
  selector: "app-constant-list",
  templateUrl: "./list.component.html",
  animations: animations
})
export class ConstantListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  tableOptions!: TableOptions<Constant>;

  // Pour les mat-header-row
  groupHeader: string[] = [];
  subHeader: string[] = [];
  visibleColumns: string[] = [];

  dataSource = new MatTableDataSource<Constant>([]); // Ajoute les données réelles ici

  doResolve() {
    this._constantService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  loadValues() {
    // Initialiser les branches
    this._branchService.branches$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Branch[]) => {
        this.branches = data || [];
      });

    // Initialiser les produits
    this._productService.products$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Product[]) => {
        this.products = data || [];
      });

    // S'abonner aux changements de sélection
    this._selectionService.selectedBranch$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(branch => {
        this.selectedBranch = branch;
        if (branch) {
          this._productService.getByBranchOrAll(branch.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();
        }
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
        }
      });

    this._selectionService.selectedPricingType$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(pricingType => {
        this.selectedPricingType = pricingType;
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

    this.loadValues()

    // Configuration du contrôle de recherche
    this.searchCtrl.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => {
        this.applyFilter(value);
      });

    // Charger les données des constantes
    this._constantService.constants$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Constant[]) => {
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
        {label: 'entities.constant.fields.label', property: 'label', type: 'text', visible: true},
        {label: 'entities.constant.fields.description', property: 'description', type: 'text', visible: true},
        {label: 'entities.constant.fields.variableName', property: 'variableName', type: 'text', visible: true},
        {label: 'entities.constant.fields.toReturn', property: 'toReturn', type: 'text', visible: true},
        {label: 'entities.constant.fields.branch', property: 'branch', type: 'text', visible: false},
        {label: 'entities.constant.fields.product', property: 'product', type: 'text', visible: false},
        {label: 'entities.constant.fields.coverage', property: 'coverage', type: 'text', visible: true},
        {label: 'entities.constant.fields.value', property: 'value', type: 'text', visible: true},
      ],
      pageSize: 8,
      pageSizeOptions: [5, 6, 8],
      actions: [],
      renderItem: (element: Constant, property: keyof Constant) => {
        if (property === 'toReturn') {
          return element.toReturn ? 'Oui' : 'Non';
        }
        if (property === 'branch') {
          return this.branches.find(b => b.id === element.branch)?.name ?? '--';
        }
        if (property === 'product') {
          return this.products.find(p => p.id === element.product)?.name ?? '--';
        }
        if (property === 'coverage') {
          return this.coverages.find(c => c.id === element.coverage)?.reference.designation ?? '--';
        }
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

      // Configuration du filtre personnalisé
      this.dataSource.filterPredicate = (data: Constant, filter: string) => {
        const searchText = filter.toLowerCase();

        // Recherche dans les propriétés de base
        const basicSearch = (
          (data.label?.toLowerCase() || '').includes(searchText) ||
          (data.description?.toLowerCase() || '').includes(searchText) ||
          (data.variableName?.toLowerCase() || '').includes(searchText) ||
          (data.value?.toString().toLowerCase() || '').includes(searchText)
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

  constructor(
    private _constantService: ConstantService,
    private _productService: ProductService,
    private _permissionService: PermissionsService,
    private _coverageService: CoverageService,
    private _branchService: BranchService,
    private _selectionService: SelectionService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
  }

  managementEntity: ManagementEntity = new ManagementEntity({});

  branches: Branch[] = [];
  selectedBranch: Branch | undefined;
  products: Product[] = []
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  selectedProduct: Product | undefined;
  coverages: Coverage[] = [];
  selectedPricingType: PricingType | undefined;
  data: Constant[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<Constant>(true, []);
  searchInputControl: UntypedFormControl = new UntypedFormControl();

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
      this._dialog.open(ConstantFormComponent, {
        width: '600px',
        disableClose: true,
        data: {
          mode: 'create',
          branch: this.selectedBranch!.id,
          product: this.selectedProduct!.id,
          pricingType: this.selectedPricingType!.id
        }
      }).afterClosed().subscribe((result) => {
        if (result) {
          this._constantService.getAll().subscribe(() => {
            // Réappliquer le filtre après le rechargement des données
            if (this.searchCtrl.value) {
              this.applyFilter(this.searchCtrl.value);
            }
          });
        }
      });
    });

  }

  onDelete(constant: Constant): void {
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
        this._constantService.delete(constant.id).subscribe({
          next: () => {
            this._snackBar.open('entities.constant.delete.success', '', {
              duration: 3000,
              panelClass: 'snackbar-success'
            });
            this._constantService.getAll().subscribe(() => {
              // Réappliquer le filtre après le rechargement des données
              if (this.searchCtrl.value) {
                this.applyFilter(this.searchCtrl.value);
              }
            });
          },
          error: () => {
            this._snackBar.open('entities.constant.delete.error', '', {duration: 3000, panelClass: 'snackbar-error'});
          }
        });
      }
    });

  }

  /**
   * Edit Constant
   */
  onEdit(constant: Constant): void {
    this._dialog.open(ConstantFormComponent, {
      width: '600px',
      disableClose: true,
      data: {
        mode: 'edit',
        ...constant
      }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this._constantService.getAll().subscribe(() => {
          // Réappliquer le filtre après le rechargement des données
          if (this.searchCtrl.value) {
            this.applyFilter(this.searchCtrl.value);
          }
        });
      }
    });
  }


  onView(constant: Constant): void {
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


  trackByProperty(index: number, column: TableColumn<Constant>) {
    return column.property;
  }
}
