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
import {Product} from "@core/services/settings/product/product.interface";
import {ProductService} from "@core/services/settings/product/product.service";
import {animations} from "@lhacksrt/animations";
import {TableOptions, TableColumn} from "@lhacksrt/components/table/table.interface";
import {Subject, takeUntil} from "rxjs";
import {ConstantService} from "@core/services/pricing/constant/constant.service";
import {Branch} from "@core/services/settings/branch/branch.interface";
import {BranchService} from "@core/services/settings/branch/branch.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDeleteComponent} from "@shared/components/confirm-delete/confirm-delete.component";
import {SelectionService} from "../../shared/services/selection.service";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";
import {PricingTypeFormComponent} from "../form/form.component";
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";
import {PricingTypeService} from "@core/services/pricing/pricing-type/pricing-type.service";
import {PricingTypeDetailedFormComponent} from "../detailed-form/form.component";

@Component({
  selector: "app-constant-list",
  templateUrl: "./list.component.html",
  animations: animations
})
export class PricingTypeListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  tableOptions!: TableOptions<PricingType>;
  // Pour les mat-header-row
  groupHeader: string[] = [];
  subHeader: string[] = [];
  visibleColumns: string[] = [];
  dataSource = new MatTableDataSource<PricingType>([]); // Ajoute les données réelles ici

  doResolve() {
    this._pricingTypeService.getAll()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  loadValues() {
    this._branchService.branches$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Branch[]) => {
        this.branches = data || [];
      });

    this._productService.products$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Product[]) => {
        this.products = data || [];
      });

    this._selectionService.selectedBranch$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(branch => {
        this.selectedBranch = branch;
        this.filterPricingTypes();
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
        this.filterPricingTypes();
        if (product) {
          this._coverageService.getByProduct(product.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((coverages: Coverage[]) => {
              this.coverages = coverages || [];
            });
        }
      });
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
        pt.product === this.selectedProduct?.id
      );

      this.dataSource.data = filteredData;

      if (this.searchCtrl.value) {
        this.applyFilter(this.searchCtrl.value);
      }
    }
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
    this._pricingTypeService.pricingTypes$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: PricingType[]) => {
        this.data = data;
        this.dataSource.data = data;
        // Appliquer le filtre actuel après le chargement des données
        if (this.searchCtrl.value) {
          this.applyFilter(this.searchCtrl.value);
        }
        this.filterPricingTypes();
      });


    // Initialisation de la configuration de la table
    this.tableOptions = {
      title: '',
      columns: [
        {label: 'entities.pricing-type.fields.name', property: 'name', type: 'text', visible: true},
        {label: 'entities.pricing-type.fields.description', property: 'description', type: 'text', visible: true},
        // { label: 'entities.pricing-type.fields.branch', property: 'branch', type: 'text', visible: true },
        // { label: 'entities.pricing-type.fields.product', property: 'product', type: 'text', visible: true },
      ],
      pageSize: 8,
      pageSizeOptions: [5, 6, 8],
      actions: [],
      renderItem: (element: PricingType, property: keyof PricingType) => {
        // if (property === 'branch') {
        //       return this.branches.find(b => b.id === element.branch)?.name ?? '--';
        // }
        // if (property === 'product') {
        //     return this.products.find(p => p.id === element.product)?.name ?? '--';
        // }
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
      this.dataSource.filterPredicate = (data: PricingType, filter: string) => {
        const searchText = filter.toLowerCase();

        // Recherche dans les propriétés de base
        const basicSearch = (
          (data.name?.toLowerCase() || '').includes(searchText) ||
          (data.description?.toLowerCase() || '').includes(searchText) ||
          (data.product?.toLowerCase() || '').includes(searchText)
          // (data.value?.toString().toLowerCase() || '').includes(searchText)
        );

        // Recherche dans le nom de la branche
        const branchName = this.branches.find(b => b.id === data.branch)?.name?.toLowerCase() || '';
        const branchSearch = branchName.includes(searchText);

        // Recherche dans le nom du produit
        const productName = this.products.find(p => p.id === data.product)?.name?.toLowerCase() || '';
        const productSearch = productName.includes(searchText);

        return basicSearch || branchSearch || productSearch;
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
    private _pricingTypeService: PricingTypeService,
    private _productService: ProductService,
    private _permissionService: PermissionsService,
    private _coverageService: CoverageService,
    private _branchService: BranchService,
    private _selectionService: SelectionService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
  }

  branches: Branch[] = [];
  selectedBranch: Branch | undefined;
  products: Product[] = []
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  selectedProduct: Product | undefined;
  coverages: Coverage[] = [];
  data: PricingType[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selection = new SelectionModel<PricingType>(true, []);
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  managementEntity: ManagementEntity = new ManagementEntity({});


  doIfHasAllSelections(
    action: () => void
  ): any {
    const hasAllSelections = this._selectionService.hasAllSelections(['branch', 'product']);
    if (!hasAllSelections.value) {
      switch (hasAllSelections.missing[0]) {
        case 'branch':
          this._snackBar.open("entities.selection.branch.incomplete", "close", {duration: 3000});
          break;
        case 'product':
          this._snackBar.open("entities.selection.product.incomplete", "close", {duration: 3000});
          break;
      }
      return;
    }
    action();
  }

  onAdd(): void {
    this.doIfHasAllSelections(() => {
      this._dialog.open(PricingTypeFormComponent, {
        width: '600px',
        disableClose: true,
        data: {
          mode: 'create',
          product: this.selectedProduct?.id,
          branch: this.selectedBranch?.id
        }
      }).afterClosed().subscribe((result) => {
        if (result) {
          this._pricingTypeService.getAll().subscribe(() => {
            // Appliquer le filtre après l'ajout
            this.filterPricingTypes();
          });
        }
      });
    });

  }

  onDelete(pricingType: PricingType): void {
    this._dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        title: 'entities.pricing-type.delete.title',
        message: 'entities.pricing-type.delete.message',
        confirmButtonText: 'actions.delete',
        cancelButtonText: 'actions.cancel'
      }
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._pricingTypeService.delete(pricingType.id).subscribe({
          next: () => {
            this._snackBar.open('entities.pricing-type.delete.success', '', {
              duration: 3000,
              panelClass: 'snackbar-success'
            });
            // Recharger les données après la suppression
            this._pricingTypeService.getAll().subscribe(() => {
              this.filterPricingTypes();
            });
          },
          error: () => {
            this._snackBar.open('entities.pricing-type.delete.error', '', {
              duration: 3000,
              panelClass: 'snackbar-error'
            });
          }
        });
      }
    });

  }

  onView(pricingType: PricingType) {
    this._dialog.open(PricingTypeDetailedFormComponent, {
      width: '600px',
      disableClose: true,
      data: {
        mode: 'view',
        ...pricingType
      }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this._pricingTypeService.getAll().subscribe(() => {
          this.filterPricingTypes();
        });
      }
    });
  }

  /**
   * Edit Constant
   */
  onEdit(pricingType: PricingType): void {
    this._dialog.open(PricingTypeFormComponent, {
      width: '600px',
      disableClose: true,
      data: {
        mode: 'edit',
        ...pricingType
      }
    }).afterClosed().subscribe((result) => {
      if (result) {
        this._pricingTypeService.getAll().subscribe(() => {
          this.filterPricingTypes();
        });
      }
    });
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

  trackByProperty(index: number, column: TableColumn<PricingType>) {
    return column.property;
  }


}
