import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
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
import { Field} from "@core/services/pricing/field/field.interface";
import { FieldService } from "@core/services/pricing/field/field.service";
import {Branch} from "@core/services/settings/branch/branch.interface";
import {BranchService} from "@core/services/settings/branch/branch.service";
import {UntypedFormControl} from "@angular/forms";
import { NumericFieldFormComponent } from "../numeric-form/form.component";
import {SelectFieldFormComponent} from "../select-form/form.component";
import {MatSnackBar} from "@angular/material/snack-bar";

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

    constructor(
        private _fieldService: FieldService,
        private _productService: ProductService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _branchService: BranchService,
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {
    }


    data: Field[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<Field>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});
  ngOnInit(): void {

      // Charger les données des champs
      this._fieldService.getAll().subscribe();

      this._fieldService.fields$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Field[]) => {
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
          title: 'entities.pricing.field.table.title',
          columns: [
              // label: string;
              // description: string;
              // variableName: string;
              // toReturn: boolean;
              // managementEntityId: string;
              // productId: string;
              // branchId: string;
              // type: "NUMERIC" | "SELECT";
              // options: SelectFieldOptions | null;
              // value: SelectFieldOptionValue | null;

              // { label: 'entities.pricing.field.fields.label', property: 'label', type: 'text', visible: true },
              { label: 'entities.pricing.field.fields.description', property: 'description', type: 'text', visible: true },
              { label: 'entities.pricing.field.fields.variableName', property: 'variableName', type: 'text', visible: true },
              { label: 'entities.pricing.field.fields.toReturn', property: 'toReturn', type: 'text', visible: true },
              // { label: 'entities.pricing.field.fields.managementEntityId', property: 'managementEntity', type: 'text', visible: true },
              { label: 'entities.pricing.field.fields.branch', property: 'branch', type: 'text', visible: true },
              { label: 'entities.pricing.field.fields.product', property: 'product', type: 'text', visible: true },
              { label: 'entities.pricing.field.fields.type', property: 'type', type: 'text', visible: true },
              { label: 'entities.pricing.field.fields.options', property: 'options', type: 'text', visible: true },
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
                  return element.type === 'NUMBER' ? 'Numérique' : 'Sélection';
              }
              if (property === 'options') {
                  return element.options ? element.options.label : 'Aucune option';
              }
              // if (property === 'value') {
              //     if (element.value instanceof SelectFieldOptionValue) {
              //         return element.value.label;
              //     }
              //     return element.value ? element.value : 'Aucune valeur';
              // }

              return element[property] ?? '--';
          },
      };

      this._fieldService.fields$.subscribe({
          next: (data: Field[]) => {
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

  branches: Branch[] = [];
  selectedBranch: Branch | undefined;

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
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  selectedProduct: Product|undefined = new Product({});

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

  onAddNumeric(): void {

    if (!this.selectedBranch) {
      this._snackBar.open("entities.branch-selection.not-select-error-title", "close", { duration: 3000 });
      return;
    }

    if (!this.selectedProduct) {
      this._snackBar.open("entities.product-selection.not-select-error-title", "", { duration: 3000 });
      return;
    }

      this._dialog.open(NumericFieldFormComponent, {
          width: '600px',
          disableClose: true,
          data: {
              mode: 'create',
              product: this.selectedProduct!.id,
              branch: this.selectedBranch!.id
          }
      }).afterClosed().subscribe((result) => {
          if (result) {
              this._productService.getAll().subscribe();
          }
      });
  }

  onAddSelect(): void {
    this._dialog.open(SelectFieldFormComponent, {
      width: '600px',
      disableClose: true,
      data: {
        mode: 'create',
        product: this.selectedProduct!.id,
        branch: this.selectedBranch!.id
      }
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
  onEdit(product: Product): void {

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

  trackByProperty(index: number, column: TableColumn<Field>) {
      return column.property;
  }
}
