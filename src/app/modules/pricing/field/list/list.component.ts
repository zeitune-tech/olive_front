import {SelectionModel} from "@angular/cdk/collections";
import {ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
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
import {Field, FieldType} from "@core/services/pricing/field/field.interface";
import {FieldService} from "@core/services/pricing/field/field.service";
import {Branch} from "@core/services/settings/branch/branch.interface";
import {BranchService} from "@core/services/settings/branch/branch.service";
import {UntypedFormControl} from "@angular/forms";
import {NumericFieldFormComponent} from "../numeric-form/form.component";
import {SelectFieldFormComponent} from "../select-form/form.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmDeleteComponent} from "@shared/components/confirm-delete/confirm-delete.component";
import {CoverageService} from "@core/services/settings/coverage/coverage.service";
import {Coverage} from "@core/services/settings/coverage/coverage.interface";
import {SelectionService} from "../../shared/services/selection.service";
import {PricingType} from "@core/services/pricing/pricing-type/pricing-type.model";
import {DeclarationFieldFormComponent} from "../declaration-form/form.component";

@Component({
  selector: "app-field-list",
  templateUrl: "./list.component.html",
  animations: animations
})
export class FieldListComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  tableOptions!: TableOptions<Field>;

  // Pour les mat-header-row
  groupHeader: string[] = [];
  subHeader: string[] = [];
  visibleColumns: string[] = [];
  dataSource = new MatTableDataSource<Field>([]); // Ajoute les données réelles ici
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Field>(true, []);
  // searchInputControl: UntypedFormControl = new UntypedFormControl();
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  doResolve() {
    this._fieldService.getAll()
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
          this.filterPricingTypes()
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

    // Configuration du contrôle de recherche
    this.searchCtrl.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => {
        this.applyFilter(value);
      });

    this.doResolve();
    this.loadValues();

    // Charger les données des champs
    this._fieldService.fields$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Field[]) => {
        this.data = data;
        this.dataSource.data = data;
        if (this.searchCtrl.value) {
          this.applyFilter(this.searchCtrl.value);
        }
        this.filterPricingTypes()
      });

    // Initialisation de la configuration de la table
    this.tableOptions = {
      title: 'entities.pricing.field.table.title',
      columns: [
        {label: 'entities.pricing.field.fields.label', property: 'label', type: 'text', visible: true},
        {label: 'entities.pricing.field.fields.description', property: 'description', type: 'text', visible: true},
        {label: 'entities.pricing.field.fields.variableName', property: 'variableName', type: 'text', visible: true},
        {label: 'entities.pricing.field.fields.toReturn', property: 'toReturn', type: 'text', visible: true},
        // { label: 'entities.pricing.field.fields.managementEntityId', property: 'managementEntity', type: 'text', visible: true },
        // {label: 'entities.pricing.field.fields.branch', property: 'branch', type: 'text', visible: true},
        // {label: 'entities.pricing.field.fields.product', property: 'product', type: 'text', visible: true},
        {label: 'entities.pricing.field.fields.coverage', property: 'coverage', type: 'text', visible: true},
        {label: 'entities.pricing.field.fields.type', property: 'type', type: 'text', visible: true},
        {label: 'entities.pricing.field.fields.options', property: 'options', type: 'text', visible: true},
        // { label: 'entities.pricing.field.fields.value', property: 'value', type: 'text', visible: true },

      ],
      pageSize: 8,
      pageSizeOptions: [5, 6, 8],
      actions: [],
      renderItem: (element: Field, property: keyof Field) => {
        if (property === 'toReturn') {
          return element.toReturn ? 'Oui' : 'Non';
        }
        if (property === 'type') {
          return element.type === FieldType.NUMBER ? 'Numérique' : 'Sélection';
        }
        if (property === 'options') {
          return element.options ? element.options.label : 'Aucune option';
        }
        // if (property === 'branch') {
        //   return this.branches.find(b => b.id === element.branch)?.name ?? '--';
        // }
        // if (property === 'product') {
        //   return this.products.find(p => p.id === element.product)?.name ?? '--';
        // }
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
    private _fieldService: FieldService,
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
  data: Field[] = [];

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

  onAddNumeric(): void {
    this.doIfHasAllSelections(() => {
      this._dialog.open(NumericFieldFormComponent, {
        width: '600px',
        disableClose: true,
        data: {
          mode: 'create',
          branch: this.selectedBranch!.id,
          product: this.selectedProduct!.id,
          pricingType: this.selectedPricingType!.id,
        }
      }).afterClosed().subscribe((result) => {
        if (result) {
          this._fieldService.getAll().subscribe(
            (fields) => {
              this.data = fields || [];
            }
          );
          this.filterPricingTypes()
        }
      });
    });
  }

  onAddSelect(): void {
    this.doIfHasAllSelections(() => {
      this._dialog.open(SelectFieldFormComponent, {
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
          this._fieldService.getAll().subscribe(
            (fields) => {
              this.data = fields || [];
            }
          );
          this.filterPricingTypes()
        }
      });
    });
  }

  onDeclaration() {
    this.doIfHasAllSelections(() => {
      this._dialog.open(DeclarationFieldFormComponent, {
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
          this._fieldService.getAll().subscribe(
            (fields) => {
              this.data = fields || [];
            }
          );
          this.filterPricingTypes()
        }
      });
    });
  }

  onDelete(field: Field): void {
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
        this._fieldService.delete(field, field.id).subscribe({
          next: () => {
            this._snackBar.open('entities.field.delete.success', '', {duration: 3000, panelClass: 'snackbar-success'});
            this._fieldService.getAll().subscribe();
          },
          error: () => {
            this._snackBar.open('entities.constant.delete.error', '', {duration: 3000, panelClass: 'snackbar-error'});
          }
        });
        this.filterPricingTypes()
      }
    });
  }

  /**
   * Edit Product Product
   */
  onEdit(field: Field): void {
    if (field.type === FieldType.NUMBER) {
      this._dialog.open(NumericFieldFormComponent, {
        width: '600px',
        disableClose: true,
        data: {
          ...field,
          mode: 'edit',
        }
      }).afterClosed().subscribe((result) => {
        if (result) {
          this._fieldService.fields$.subscribe((fields: Field[]) => {
            this.data = fields || [];
            this.dataSource.data = fields || [];
          });
        }
      });
    } else if (field.type === FieldType.SELECT) {
      this._dialog.open(SelectFieldFormComponent, {
        width: '600px',
        disableClose: true,
        data: {
          ...field,
          mode: 'edit',
        }
      }).afterClosed().subscribe((result) => {
        if (result) {
          this._productService.getAll().subscribe();
        }
      });
    }

  }

  onView(product: Product): void {
    //this._router.navigate(['/administration/products/list']);
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

  trackByProperty(index: number, column: TableColumn<Field>) {
    return column.property;
  }


}
