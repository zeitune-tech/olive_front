import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
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
import {UntypedFormControl} from "@angular/forms";
import { VariableConditionService } from "@core/services/pricing/variable-condition/variable-condition.service";
import { VariableCondition } from "@core/services/pricing/variable-condition/variable-condition.interface";

@Component({
    selector: "app-variable_condition-list",
    templateUrl: "./list.component.html",
    // template: "<lh-table [dataSource]='dataSource' [tableOptions]='tableOptions' [groupHeader]='groupHeader' [subHeader]='subHeader' [visibleColumns]='visibleColumns'></lh-table>",
    animations: animations
})
export class VariableConditionListComponent implements OnInit, AfterViewInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tableOptions!: TableOptions<VariableCondition>;

    // Pour les mat-header-row
    groupHeader: string[] = [];
    subHeader: string[] = [];
    visibleColumns: string[] = [];

    dataSource = new MatTableDataSource<VariableCondition>([]); // Ajoute les données réelles ici

    constructor(
        private _variableConditionService: VariableConditionService,
        private _productService: ProductService,
        private _permissionService: PermissionsService,
        private _managementEntityService: ManagementEntityService,
        private _branchService: BranchService,
        private _dialog: MatDialog
    ) {
    }

    data: VariableCondition[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    selection = new SelectionModel<VariableCondition>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    managementEntity: ManagementEntity = new ManagementEntity({});

    ngOnInit(): void {

      // Charger les données des champs
      this._variableConditionService.getAll().subscribe();

      this._variableConditionService.variableConditions$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: VariableCondition []) => {
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
          title: 'entities.pricing.variable-conditions.table.title',
          columns: [
              // label: string;
              // description: string;
              // variableName: string;
              // toReturn: boolean;
              // managementEntityId: string;
              // productId: string;
              // coverageId: string;
              // Set<RuleResponseDTO> rules,

              { label: 'entities.pricing.variable-conditions.fields.description', property: 'description', type: 'text', visible: true },
              { label: 'entities.pricing.variable-conditions.fields.variableName', property: 'variableName', type: 'text', visible: true },
              { label: 'entities.pricing.variable-conditions.fields.toReturn', property: 'toReturn', type: 'text', visible: true },
              { label: 'entities.pricing.variable-conditions.fields.coverageId', property: 'coverage', type: 'text', visible: true },
              { label: 'entities.pricing.variable-conditions.fields.rules', property: 'rules', type: 'text', visible: true },

          ],
          pageSize: 8,
          pageSizeOptions: [5, 6, 8],
          actions: [],
          renderItem: (element: VariableCondition, property: keyof VariableCondition) => {
              if (property === 'toReturn') {
                  return element.toReturn ? 'Oui' : 'Non';
              }
                if (property === 'rules') {
                    return element.rules ? element.rules.map(rule => rule.name).join(', ') : 'Aucune règle définie';
                }

              return element[property] ?? '--';
          },
      };

      this._variableConditionService.variableConditions$.subscribe({
          next: (data: VariableCondition[]) => {
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
        
        // Définir la taille de page initiale
        if (this.paginator && this.tableOptions.pageSize) {
            this.paginator.pageSize = this.tableOptions.pageSize;
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
        // this.dataSource.data = this.data.filter(coverage => coverage.product.id === this.selectedProduct.id);
        this.dataSource.paginator = this.paginator;
        // this._changeDetectorRef.detectChanges();
      }
    })
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


    trackByProperty(index: number, column: TableColumn<VariableCondition>) {
        return column.property;
    }
}
